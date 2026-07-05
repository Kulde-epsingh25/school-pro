import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// In a real application, this would decode a JWT. 
// For this prototype, we'll assume the frontend sends the userId in headers.
export const tenantIsolation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    // We also expect the tenantId to be provided, either in the URL params, query, or body
    // However, some routes (like global SaaS routes) might not have a tenantId.
    const requestedTenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId;

    if (!userId) {
      // If no user is authenticated, we might let it pass if it's a public route,
      // but assuming this middleware is applied to protected routes:
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        saasSuperAdmin: true,
        tenantSuperAdmin: { select: { tenantId: true } },
        tenantRoles: { select: { tenantId: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Attach user to request for downstream use
    (req as any).user = user;

    // SaaS Super Admins bypass tenant isolation completely
    if (user.saasSuperAdmin) {
      return next();
    }

    // If the route doesn't specify a tenantId, we can't enforce isolation here.
    // Downstream controllers must handle it, OR we reject if tenantId is missing.
    // For now, we'll enforce that if a tenantId IS provided, the user must belong to it.
    if (requestedTenantId) {
      const authorizedTenantIds = new Set<string>();
      
      if (user.tenantSuperAdmin) {
        authorizedTenantIds.add(user.tenantSuperAdmin.tenantId);
      }
      
      user.tenantRoles.forEach(tr => {
        authorizedTenantIds.add(tr.tenantId);
      });

      if (!authorizedTenantIds.has(requestedTenantId)) {
        return res.status(403).json({ 
          error: "Forbidden: You do not have access to this tenant's data",
          code: "TENANT_ISOLATION_VIOLATION" 
        });
      }
    }

    next();
  } catch (error) {
    console.error("[Tenant Isolation Error]", error);
    res.status(500).json({ error: "Internal server error during isolation check" });
  }
};
