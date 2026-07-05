import { Request, Response } from "express";
import { prisma } from "../db";

export async function getTenants(req: Request, res: Response) {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        subscription: true,
        _count: {
          select: { users: true }
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
    const { name, domain, adminFirstName, adminLastName, adminEmail, plan } = req.body;

    // 1. Create the tenant
    const tenant = await prisma.tenant.create({
      data: {
        name,
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
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: "TempPassword123!", // In real app, send welcome email to set password
        firstName: adminFirstName,
        lastName: adminLastName,
        isActive: true
      }
    });

    // 3. Get or Create SUPER_ADMIN Role (Tenant level)
    let adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "ADMIN", description: "Tenant Administrator" }
      });
    }

    // 4. Link User to Tenant and Role
    await prisma.userTenant.create({
      data: {
        userId: adminUser.id,
        tenantId: tenant.id,
        roles: {
          create: {
            roleId: adminRole.id
          }
        }
      }
    });

    // 5. Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        resourceType: "TENANT",
        resourceId: tenant.id,
        actorEmail: "superadmin@system.local", // System actor for now
        details: JSON.stringify({ name, domain, plan }),
        status: "SUCCESS"
      }
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create tenant" });
  }
}
