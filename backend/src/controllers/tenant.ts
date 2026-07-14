import { Request, Response } from "express";
import { db } from "../db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function getTenants(req: Request, res: Response) {
  try {
    const tenants = await db.tenant.findMany({
      include: {
        subscription: true,
        _count: {
          select: { tenantUserRoles: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
}

export async function createTenant(req: Request, res: Response) {
  try {
    const { name, schoolName, domain, adminFirstName, adminLastName, adminEmail, plan, logoBase64 } = req.body;
    const finalName = name || schoolName;
    const finalDomain = domain && domain.trim() !== "" ? domain.trim() : undefined;

    const tenantResult = await db.$transaction(async (tx) => {
      // 1. Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: finalName,
          domain: finalDomain,
          logo: logoBase64,
          subscription: {
            create: {
              plan: plan || "starter",
              status: "ACTIVE",
              billingCycle: "MONTHLY",
              amount: 99
            }
          }
        }
      });

      // 2. Create the Admin User
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: "TempPassword123!", // In real app, send welcome email to set password
          firstName: adminFirstName,
          lastName: adminLastName,
          isActive: false // User must verify email and set password to activate
        }
      });

      // 3. Set as Tenant Super Admin
      await tx.tenantSuperAdmin.create({
        data: {
          tenantId: tenant.id,
          userId: adminUser.id
        }
      });

      // 6. Audit Log
      await tx.tenantAuditLog.create({
        data: {
          tenantId: tenant.id,
          action: "CREATE",
          resourceType: "TENANT",
          resourceId: tenant.id,
          actorId: adminUser.id,
          changes: JSON.stringify({ name: finalName, domain, plan }),
          status: "SUCCESS"
        }
      });

      return { tenant, adminUser };
    });

    // Seed default permissions OUTSIDE the transaction to bypass MongoDB transaction limits
    const defaultSubjects = ["USERS", "ROLES", "FEES", "CLASSES", "STUDENTS", "SETTINGS", "REPORTS", "DEPARTMENTS", "SUBJECTS"];
    const defaultActions = ["CREATE", "READ", "UPDATE", "DELETE"];
    const defaultScopes = ["ALL", "DEPARTMENT", "OWN_ONLY"];
    
    const permissionsToCreate = [];
    for (const subject of defaultSubjects) {
      for (const action of defaultActions) {
        for (const scope of defaultScopes) {
          permissionsToCreate.push({
            tenantId: tenantResult.tenant.id,
            action,
            subject,
            scope,
            description: `Can ${action.toLowerCase()} ${subject.toLowerCase()} (${scope.toLowerCase()})`
          });
        }
      }
    }

    const createdPermissions = await Promise.all(
      permissionsToCreate.map(p => db.tenantPermission.create({ data: p }))
    );

    // Seed default roles OUTSIDE the transaction
    const defaultRoles = [
      { name: "SUPER_ADMIN", displayName: "Super Administrator", desc: "Full administrative access" },
      { name: "DEPARTMENT_ADMIN", displayName: "Department Head", desc: "Department level access" },
      { name: "FINANCE_ADMIN", displayName: "Finance Officer", desc: "Financial management access" },
      { name: "ACADEMIC_ADMIN", displayName: "Academic Coordinator", desc: "Academic management access" }
    ];

    let superAdminRole;
    
    for (const roleData of defaultRoles) {
      const role = await db.tenantRole.create({
        data: {
          tenantId: tenantResult.tenant.id,
          name: roleData.name,
          displayName: roleData.displayName,
          description: roleData.desc,
          createdBy: tenantResult.adminUser.id
        }
      });

      if (roleData.name === "SUPER_ADMIN") {
        superAdminRole = role;
        const rolePerms = createdPermissions.map(p => ({
          roleId: role.id,
          permissionId: p.id
        }));
        await db.tenantRolePermission.createMany({ data: rolePerms });
      } else if (roleData.name === "FINANCE_ADMIN") {
        const financePerms = createdPermissions
          .filter(p => ["FEES", "REPORTS", "STUDENTS"].includes(p.subject))
          .map(p => ({ roleId: role.id, permissionId: p.id }));
        await db.tenantRolePermission.createMany({ data: financePerms });
      } else if (roleData.name === "ACADEMIC_ADMIN") {
        const academicPerms = createdPermissions
          .filter(p => ["CLASSES", "SUBJECTS", "STUDENTS", "REPORTS", "DEPARTMENTS"].includes(p.subject))
          .map(p => ({ roleId: role.id, permissionId: p.id }));
        await db.tenantRolePermission.createMany({ data: academicPerms });
      }
    }

    // Link User to SUPER_ADMIN TenantRole
    if (superAdminRole) {
      await db.tenantUserRole.create({
        data: {
          userId: tenantResult.adminUser.id,
          tenantId: tenantResult.tenant.id,
          roleId: superAdminRole.id,
          assignedBy: tenantResult.adminUser.id
        }
      });
    }

    // 7. Generate the "Magic Link" token (mocking email sending)
    const verificationToken = Buffer.from(`${tenantResult.adminUser.id}:${tenantResult.tenant.id}`).toString('base64');
    
    // Use the actual request origin or a fallback
    const baseUrl = req.headers.origin || "https://school-pro-mocha-beta.vercel.app";
    const magicLink = `${baseUrl}/auth/verify?token=${verificationToken}`;

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "School Management Pro <noreply@schoolpro.app>", // Update with verified domain if applicable
        to: adminEmail,
        subject: "Welcome to School Management Pro - Verify Your Account",
        html: `
          <h1>Welcome to School Management Pro</h1>
          <p>Hi ${adminFirstName},</p>
          <p>Your institution <strong>${finalName}</strong> has been successfully provisioned.</p>
          <p>Please click the link below to verify your account and set up your secure password:</p>
          <a href="${magicLink}" style="display:inline-block;padding:10px 20px;background:#2563EB;color:white;text-decoration:none;border-radius:5px;">Set My Password</a>
        `,
      });
      console.log(`[EMAIL SENT] Verification email sent to ${adminEmail} via Resend.`);
    } else {
      console.log("=========================================================");
      console.log(`[MOCK EMAIL] To: ${adminEmail}`);
      console.log(`[MOCK EMAIL] Subject: Welcome to School Management Pro`);
      console.log(`[MOCK EMAIL] Body: Please verify your account and set your password:`);
      console.log(`[MOCK EMAIL] Link: ${magicLink}`);
      console.log("=========================================================");
    }

    res.status(201).json(tenantResult.tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create tenant" });
  }
}
