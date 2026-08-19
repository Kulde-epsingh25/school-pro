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

      // SaaS Super Admins can bypass all RBAC restrictions
      if (user.saasSuperAdmin || (user.roles && (user.roles.includes("saas_super_admin") || user.roles.includes("SAAS_SUPER_ADMIN")))) {
        return next();
      }

      // Tenant Super Admins bypass permissions for their specific tenant
      if (
        (user.tenantSuperAdmin && (!requestedTenantId || user.tenantSuperAdmin.tenantId === requestedTenantId)) ||
        (user.roles && (user.roles.includes("super_admin") || user.roles.includes("SUPER_ADMIN")))
      ) {
        return next();
      }

      if (!requestedTenantId) {
        return res.status(400).json({ error: "tenantId is required for permission check" });
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

      // Scope precedence: ALL > DEPARTMENT > OWN_ONLY
      const scopeRank: Record<string, number> = { "ALL": 3, "DEPARTMENT": 2, "OWN_ONLY": 1 };
      
      let highestScope: string | null = null;
      let hasPermission = false;

      for (const assignment of userRoleAssignments) {
        for (const rolePerm of assignment.role.permissions) {
          const p = rolePerm.permission;
          if (p.action === action && p.subject === subject) {
            hasPermission = true;
            if (!highestScope || scopeRank[p.scope] > scopeRank[highestScope]) {
              highestScope = p.scope;
            }
          }
        }
      }

      if (!hasPermission) {
        return res.status(403).json({ 
          error: `Forbidden: Missing required permission [${action} ${subject}]`,
          code: "INSUFFICIENT_PERMISSIONS"
        });
      }

      (req as any).permissionScope = highestScope;
      next();
    } catch (error) {
      console.error("[RBAC Error]", error);
      res.status(500).json({ error: "Internal server error during permission check" });
    }
  };
};
