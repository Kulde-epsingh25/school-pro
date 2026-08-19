import { Request, Response } from "express";
import { db as prisma } from "../db";


export const getTenantAuditLogs = async (req: Request, res: Response) => {
  const { tenantId, action, resourceType, startDate, endDate } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause: any = { tenantId };

    if (action) {
      whereClause.action = String(action);
    }
    
    if (resourceType) {
      whereClause.resourceType = String(resourceType);
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(String(startDate));
      if (endDate) whereClause.createdAt.lte = new Date(String(endDate));
    }

    const logs = await prisma.tenantAuditLog.findMany({
      where: whereClause,
      include: {
        actor: { select: { id: true, firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit results for performance
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('[API Error in getTenantAuditLogs]', error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};

export const getSaaSAuditLogs = async (req: Request, res: Response) => {
  const { action, resourceType, startDate, endDate, specificTenantId } = req.query;

  try {
    // Only SaaS Super Admins can reach this due to middleware checks, so we can return all logs
    const whereClause: any = {};

    if (specificTenantId) {
      whereClause.tenantId = String(specificTenantId);
    }

    if (action) {
      whereClause.action = String(action);
    }
    
    if (resourceType) {
      whereClause.resourceType = String(resourceType);
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(String(startDate));
      if (endDate) whereClause.createdAt.lte = new Date(String(endDate));
    }

    const logs = await prisma.tenantAuditLog.findMany({
      where: whereClause,
      include: {
        actor: { select: { id: true, firstName: true, lastName: true, email: true } },
        tenant: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200 
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('[API Error in getSaaSAuditLogs]', error);
    res.status(500).json({ error: "Failed to fetch SaaS audit logs" });
  }
};

