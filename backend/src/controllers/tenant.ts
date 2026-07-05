import { Request, Response } from "express";
import { db } from "../db";

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
    const { name, schoolName, domain, adminFirstName, adminLastName, adminEmail, plan } = req.body;
    const finalName = name || schoolName;

    const tenantResult = await db.$transaction(async (tx) => {
      // 1. Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: finalName,
          domain,
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
          isActive: true
        }
      });

      // 3. Set as Tenant Super Admin
      await tx.tenantSuperAdmin.create({
        data: {
          tenantId: tenant.id,
          userId: adminUser.id
        }
      });

      // 4. Create default permissions for the tenant
      const defaultSubjects = ["USERS", "ROLES", "FEES", "CLASSES", "STUDENTS", "SETTINGS", "REPORTS", "DEPARTMENTS", "SUBJECTS"];
      const defaultActions = ["CREATE", "READ", "UPDATE", "DELETE"];
      
      const permissionsToCreate = [];
      for (const subject of defaultSubjects) {
        for (const action of defaultActions) {
          permissionsToCreate.push({
            tenantId: tenant.id,
            action,
            subject,
            scope: "ALL",
            description: `Can ${action.toLowerCase()} ${subject.toLowerCase()}`
          });
        }
      }

      await tx.tenantPermission.createMany({
        data: permissionsToCreate
      });

      // Fetch the created permissions to link them
      const createdPermissions = await tx.tenantPermission.findMany({
        where: { tenantId: tenant.id }
      });

      // 5. Create default roles
      const defaultRoles = [
        { name: "SUPER_ADMIN", displayName: "Super Administrator", desc: "Full administrative access" },
        { name: "DEPARTMENT_ADMIN", displayName: "Department Head", desc: "Department level access" },
        { name: "FINANCE_ADMIN", displayName: "Finance Officer", desc: "Financial management access" },
        { name: "ACADEMIC_ADMIN", displayName: "Academic Coordinator", desc: "Academic management access" }
      ];

      let superAdminRole;
      
      for (const roleData of defaultRoles) {
        const role = await tx.tenantRole.create({
          data: {
            tenantId: tenant.id,
            name: roleData.name,
            displayName: roleData.displayName,
            description: roleData.desc,
            createdBy: adminUser.id
          }
        });

        if (roleData.name === "SUPER_ADMIN") {
          superAdminRole = role;
          // SUPER_ADMIN gets all permissions
          const rolePerms = createdPermissions.map(p => ({
            roleId: role.id,
            permissionId: p.id
          }));
          await tx.tenantRolePermission.createMany({ data: rolePerms });
        } else if (roleData.name === "FINANCE_ADMIN") {
          // Add some finance permissions
          const financePerms = createdPermissions
            .filter(p => ["FEES", "REPORTS", "STUDENTS"].includes(p.subject))
            .map(p => ({ roleId: role.id, permissionId: p.id }));
          await tx.tenantRolePermission.createMany({ data: financePerms });
        } else if (roleData.name === "ACADEMIC_ADMIN") {
          // Add some academic permissions
          const academicPerms = createdPermissions
            .filter(p => ["CLASSES", "SUBJECTS", "STUDENTS", "REPORTS", "DEPARTMENTS"].includes(p.subject))
            .map(p => ({ roleId: role.id, permissionId: p.id }));
          await tx.tenantRolePermission.createMany({ data: academicPerms });
        }
      }

      // 6. Link User to SUPER_ADMIN TenantRole via TenantUserRole
      if (superAdminRole) {
        await tx.tenantUserRole.create({
          data: {
            userId: adminUser.id,
            tenantId: tenant.id,
            roleId: superAdminRole.id,
            assignedBy: adminUser.id
          }
        });
      }

      // 6. Audit Log
      await tx.tenantAuditLog.create({
        data: {
          tenantId: tenant.id,
          action: "CREATE",
          resourceType: "TENANT",
          resourceId: tenant.id,
          actorId: adminUser.id, // The one who conceptually created this state
          changes: JSON.stringify({ name: finalName, domain, plan }),
          status: "SUCCESS"
        }
      });

      return { tenant, adminUser };
    });

    // 7. Generate the "Magic Link" token (mocking email sending)
    const verificationToken = Buffer.from(`${tenantResult.adminUser.id}:${tenantResult.tenant.id}`).toString('base64');
    
    // Use the actual request origin or a fallback
    const baseUrl = req.headers.origin || "https://school-pro-mocha-beta.vercel.app";
    const magicLink = `${baseUrl}/auth/verify?token=${verificationToken}`;

    console.log("=========================================================");
    console.log(`[MOCK EMAIL] To: ${adminEmail}`);
    console.log(`[MOCK EMAIL] Subject: Welcome to School Management Pro`);
    console.log(`[MOCK EMAIL] Body: Please verify your account and set your password:`);
    console.log(`[MOCK EMAIL] Link: ${magicLink}`);
    console.log("=========================================================");

    res.status(201).json(tenantResult.tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create tenant" });
  }
}
