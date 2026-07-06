import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSharedAccess = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const tenantSuperAdmin = await prisma.tenantSuperAdmin.findUnique({
      where: { tenantId }
    });

    if (!tenantSuperAdmin) {
      return res.status(404).json({ error: "Tenant Super Admin not found" });
    }

    res.status(200).json({ sharedWith: tenantSuperAdmin.sharedWith || [] });
  } catch (error) {
    console.error('[API Error in getSharedAccess]', error);
    res.status(500).json({ error: "Failed to fetch shared access list" });
  }
};

export const updateSharedAccess = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { sharedWith } = req.body;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  if (!Array.isArray(sharedWith)) {
    return res.status(400).json({ error: "sharedWith must be an array of emails" });
  }

  try {
    const updated = await prisma.tenantSuperAdmin.update({
      where: { tenantId },
      data: { sharedWith }
    });

    // Optionally log this security event
    const user = (req as any).user;
    if (user) {
      await prisma.tenantAuditLog.create({
        data: {
          tenantId,
          action: "UPDATE",
          resourceType: "SECURITY",
          resourceId: updated.id,
          actorId: user.id,
          changes: JSON.stringify({ sharedWith }),
          status: "SUCCESS"
        }
      });
    }

    res.status(200).json({ sharedWith: updated.sharedWith });
  } catch (error) {
    console.error('[API Error in updateSharedAccess]', error);
    res.status(500).json({ error: "Failed to update shared access list" });
  }
};
