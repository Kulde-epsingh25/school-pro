import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    // In a real app, verify current password and hash new password using bcrypt
    // For now, since password hashing isn't implemented (from Audit Report)
    const user = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword }
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
