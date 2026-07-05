import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This middleware requires tenantIsolation middleware to run first (so req.user is set).
export const requirePermission = (action: string, subject: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const requestedTenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // SaaS Super Admins can bypass everything
      if (user.saasSuperAdmin) {
        return next();
      }

      if (!requestedTenantId) {
        return res.status(400).json({ error: "tenantId is required for permission check" });
      }

      // Tenant Super Admins bypass permissions for their specific tenant
      if (user.tenantSuperAdmin && user.tenantSuperAdmin.tenantId === requestedTenantId) {
        return next();
      }

      // Otherwise, we must check if any of the user's roles within this tenant have the exact permission
      const userRoleAssignments = await prisma.tenantUserRole.findMany({
        where: {
          userId: user.id,
          tenantId: requestedTenantId
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      let hasPermission = false;
      for (const assignment of userRoleAssignments) {
        for (const rolePerm of assignment.role.permissions) {
          const p = rolePerm.permission;
          if (p.action === action && p.subject === subject) {
            hasPermission = true;
            break;
          }
        }
        if (hasPermission) break;
      }

      if (!hasPermission) {
        return res.status(403).json({ 
          error: `Forbidden: Missing required permission [${action} ${subject}]`,
          code: "INSUFFICIENT_PERMISSIONS"
        });
      }

      next();
    } catch (error) {
      console.error("[RBAC Error]", error);
      res.status(500).json({ error: "Internal server error during permission check" });
    }
  };
};
