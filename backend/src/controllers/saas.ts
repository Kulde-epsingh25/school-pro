import { Request, Response } from "express";
import { db as prisma } from "../db";
import { generateTokens } from "../utils/jwt";
import bcrypt from "bcryptjs";


export const impersonateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const adminUser = (req as any).user;

    // Find the target user with all their details
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        saasSuperAdmin: true,
        tenantSuperAdmin: { include: { tenant: true } },
        tenantRoles: { include: { role: true, tenant: true } }
      }
    });

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!targetUser.isActive) {
      return res.status(403).json({ error: "Cannot impersonate an inactive user" });
    }

    // Determine target user roles and school
    let roles: string[] = [];
    let schoolId: string | undefined;
    let schoolName: string | undefined;

    if (targetUser.saasSuperAdmin) roles.push("saas_super_admin");
    if (targetUser.tenantSuperAdmin) {
      roles.push("super_admin");
      schoolId = targetUser.tenantSuperAdmin.tenantId;
      schoolName = targetUser.tenantSuperAdmin.tenant?.name;
    }
    if (targetUser.tenantRoles.length > 0) {
      roles.push(...targetUser.tenantRoles.map((r: any) => r.role.name.toLowerCase()));
      if (!schoolId) {
        schoolId = targetUser.tenantRoles[0].tenantId;
        schoolName = targetUser.tenantRoles[0].tenant?.name;
      }
    }
    roles = [...new Set(roles)];

    // Generate short-lived impersonation token (30 min)
    const { accessToken } = generateTokens(targetUser.id, schoolId);

    // Create a critical audit log for this impersonation
    await prisma.tenantAuditLog.create({
      data: {
        action: "IMPERSONATE",
        resourceType: "USER",
        actorId: adminUser.id,
        status: "SUCCESS",
        changes: `SaaS Admin (${adminUser.email}) impersonated user ${targetUser.email}`
      }
    });

    res.json({
      message: `Impersonation token issued for ${targetUser.email}`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: `${targetUser.firstName} ${targetUser.lastName}`,
        roles,
        schoolId,
        schoolName
      },
      accessToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to impersonate user" });
  }
};

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const totalTenants = await prisma.tenant.count();
    const totalUsers = await prisma.user.count({ where: { isActive: true } });
    const activeSubs = await prisma.subscription.count({ where: { status: "ACTIVE" } });

    res.json({
      totalTenants,
      totalUsers,
      activeSubs,
      systemHealth: "99.9%"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
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
};

export const getTenantDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        subscription: true,
        tenantSuperAdmin: {
          include: { user: true }
        },
        _count: {
          select: { 
            tenantUserRoles: true,
            classes: true,
            departments: true
          }
        }
      }
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }
    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tenant details" });
  }
};

export const toggleTenantSuspension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { subscription: true }
    });

    if (!tenant || !tenant.subscription) {
      return res.status(404).json({ error: "Tenant or subscription not found" });
    }

    const newStatus = tenant.subscription.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

    const updated = await prisma.subscription.update({
      where: { id: tenant.subscription.id },
      data: { status: newStatus }
    });

    // Audit log
    await prisma.tenantAuditLog.create({
      data: {
        tenantId: id,
        action: newStatus === "SUSPENDED" ? "SUSPEND" : "RESUME",
        resourceType: "TENANT",
        actorId: (req as any).user.id,
        status: "SUCCESS"
      }
    });

    res.json({ message: `Tenant ${newStatus.toLowerCase()} successfully`, status: newStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle suspension" });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.tenantAuditLog.findMany({
      where: {
        resourceType: "TENANT",
        action: { in: ["CREATE", "SUSPEND", "RESUME"] }
      },
      include: {
        tenant: { select: { name: true } },
        actor: { select: { email: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};

export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const saasAdmin = await prisma.saaSSuperAdmin.findUnique({
      where: { userId: (req as any).user.id },
      include: { user: true }
    });
    if (!saasAdmin) {
      return res.status(404).json({ error: "SaaS Admin not found" });
    }
    res.json({
      user: {
        email: saasAdmin.user.email,
        firstName: saasAdmin.user.firstName,
        lastName: saasAdmin.user.lastName
      },
      sharedWith: saasAdmin.sharedWith || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch account details" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both currentPassword and newPassword are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }

    const user = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use bcrypt to verify the current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Hash the new password before storing
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Audit log
    await prisma.tenantAuditLog.create({
      data: {
        action: "UPDATE",
        resourceType: "USER",
        actorId: user.id,
        status: "SUCCESS",
        changes: "SaaS Admin password changed"
      }
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update password" });
  }
};


export const shareAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const saasAdmin = await prisma.saaSSuperAdmin.findUnique({
      where: { userId: (req as any).user.id }
    });

    if (!saasAdmin) {
      return res.status(404).json({ error: "SaaS Admin not found" });
    }

    const updatedSharedWith = [...new Set([...(saasAdmin.sharedWith as string[] || []), email])];

    await prisma.saaSSuperAdmin.update({
      where: { id: saasAdmin.id },
      data: { sharedWith: updatedSharedWith }
    });

    res.json({ message: `Invite sent to ${email}`, sharedWith: updatedSharedWith });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to share account" });
  }
};

export const revokeShare = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const saasAdmin = await prisma.saaSSuperAdmin.findUnique({
      where: { userId: (req as any).user.id }
    });

    if (!saasAdmin) {
      return res.status(404).json({ error: "SaaS Admin not found" });
    }

    const updatedSharedWith = (saasAdmin.sharedWith as string[] || []).filter((e: string) => e !== email);

    await prisma.saaSSuperAdmin.update({
      where: { id: saasAdmin.id },
      data: { sharedWith: updatedSharedWith }
    });

    res.json({ message: `Revoked access for ${email}`, sharedWith: updatedSharedWith });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to revoke share" });
  }
};

