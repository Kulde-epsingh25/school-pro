import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/email";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function getPlatformUsers(req: Request, res: Response) {
  try {
    const { search, tenantId, role, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } }
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          tenantRoles: {
            include: { tenant: true, role: true }
          },
          tenantSuperAdmin: { include: { tenant: true } },
          saasSuperAdmin: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum
      }),
      db.user.count({ where })
    ]);

    const formattedUsers = users
      .map((user: any) => {
        const primaryTenant = user.tenantRoles[0]?.tenant || user.tenantSuperAdmin?.tenant;

        let roles: string[] = [];
        if (user.saasSuperAdmin) roles.push("SAAS_SUPER_ADMIN");
        if (user.tenantSuperAdmin) roles.push("SUPER_ADMIN");
        if (user.tenantRoles.length > 0) {
          roles.push(...user.tenantRoles.map((r: any) => r.role.name));
        }
        if (roles.length === 0) roles.push("USER");

        const tenantName = primaryTenant ? primaryTenant.name : "System";
        const tenantIdVal = primaryTenant ? primaryTenant.id : null;

        // Apply tenantId filter post-fetch if provided
        if (tenantId && tenantIdVal !== tenantId) return null;
        // Apply role filter post-fetch if provided
        if (role && !roles.map(r => r.toLowerCase()).includes((role as string).toLowerCase())) return null;

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          tenant: tenantName,
          tenantId: tenantIdVal,
          roles: [...new Set(roles)],
          status: user.isActive ? "Active" : "Inactive",
          createdAt: user.createdAt
        };
      })
      .filter(Boolean);

    res.json({
      users: formattedUsers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch platform users" });
  }
}

export async function suspendUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await db.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    });

    // Audit log
    await db.tenantAuditLog.create({
      data: {
        action: updated.isActive ? "UNSUSPEND" : "SUSPEND",
        resourceType: "USER",
        actorId: (req as any).user.id,
        status: "SUCCESS",
        changes: `User ${user.email} ${updated.isActive ? "reactivated" : "suspended"} by SaaS Admin`
      }
    });

    res.json({ message: `User ${updated.isActive ? "reactivated" : "suspended"} successfully`, isActive: updated.isActive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user status" });
  }
}

export async function forcePasswordReset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a reset token (short-lived, 1h)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: "password_reset" },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL || "https://school-pro-mocha-beta.vercel.app"}/auth/reset-password?token=${resetToken}`;

    // Send email
    await sendVerificationEmail(user.email, resetLink, "School Pro");

    // Audit log
    await db.tenantAuditLog.create({
      data: {
        action: "FORCE_PASSWORD_RESET",
        resourceType: "USER",
        actorId: (req as any).user.id,
        status: "SUCCESS",
        changes: `Password reset forced for ${user.email}`
      }
    });

    res.json({ message: `Password reset email sent to ${user.email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send password reset" });
  }
}

export async function updateUserRoles(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { makeSaasAdmin } = req.body;

    const user = await db.user.findUnique({ where: { id }, include: { saasSuperAdmin: true } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (makeSaasAdmin && !user.saasSuperAdmin) {
      await db.saaSSuperAdmin.create({ data: { userId: id, sharedWith: [] } });
    } else if (!makeSaasAdmin && user.saasSuperAdmin) {
      await db.saaSSuperAdmin.delete({ where: { userId: id } });
    }

    // Audit log
    await db.tenantAuditLog.create({
      data: {
        action: "UPDATE_ROLE",
        resourceType: "USER",
        actorId: (req as any).user.id,
        status: "SUCCESS",
        changes: `${makeSaasAdmin ? "Granted" : "Revoked"} SAAS_SUPER_ADMIN for ${user.email}`
      }
    });

    res.json({ message: `User roles updated successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user roles" });
  }
}

