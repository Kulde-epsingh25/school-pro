import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const tenantIsolation = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Unauthorized: Missing token" 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 2. Verify JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    if (!payload.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 3. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        saasSuperAdmin: true,
        tenantSuperAdmin: { select: { tenantId: true } },
        tenantRoles: { select: { tenantId: true } }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    // 4. Attach user to request
    (req as any).user = user;
    (req as any).userId = user.id;

    // SaaS Super Admins bypass tenant isolation completely
    if (user.saasSuperAdmin) {
      return next();
    }

    // 6. For tenant-specific routes, verify access
    const requestedTenantId = req.params.tenantId || req.query.tenantId;
    
    if (requestedTenantId) {
      const authorizedTenantIds = new Set<string>();
      
      if (user.tenantSuperAdmin) {
        authorizedTenantIds.add(user.tenantSuperAdmin.tenantId);
      }
      
      user.tenantRoles.forEach(tr => {
        authorizedTenantIds.add(tr.tenantId);
      });

      if (!authorizedTenantIds.has(requestedTenantId as string)) {
        return res.status(403).json({ 
          error: "Forbidden: No access to this tenant",
          code: "TENANT_ISOLATION_VIOLATION"
        });
      }
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token" 
      });
    }

    console.error("[Tenant Isolation Error]", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
