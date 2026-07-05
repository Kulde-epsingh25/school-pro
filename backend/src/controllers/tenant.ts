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

      // 4. Create default SUPER_ADMIN TenantRole
      const adminRole = await tx.tenantRole.create({
        data: { 
          tenantId: tenant.id,
          name: "SUPER_ADMIN", 
          displayName: "Super Administrator",
          description: "Full administrative access",
          createdBy: adminUser.id
        }
      });

      // 5. Link User to TenantRole via TenantUserRole
      await tx.tenantUserRole.create({
        data: {
          userId: adminUser.id,
          tenantId: tenant.id,
          roleId: adminRole.id,
          assignedBy: adminUser.id
        }
      });

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
