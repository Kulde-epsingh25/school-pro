import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoles = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const roles = await prisma.tenantRole.findMany({
      where: { tenantId },
      include: {
        permissions: {
          include: { permission: true }
        },
        _count: {
          select: { userRoles: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error('[API Error in getRoles]', error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const permissions = await prisma.tenantPermission.findMany({
      where: { tenantId },
      orderBy: { subject: 'asc' }
    });

    res.status(200).json(permissions);
  } catch (error) {
    console.error('[API Error in getPermissions]', error);
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { tenantId, name, displayName, description, color, permissionIds } = req.body;
  
  if (!tenantId || !name || !displayName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = (req as any).user;
    const actorId = user ? user.id : null; // For createdBy

    const role = await prisma.tenantRole.create({
      data: {
        tenantId,
        name: name.toUpperCase().replace(/\s+/g, '_'),
        displayName,
        description,
        color,
        createdBy: actorId, // Required by schema
        permissions: {
          create: (permissionIds || []).map((id: string) => ({
            permissionId: id
          }))
        }
      },
      include: {
        permissions: { include: { permission: true } }
      }
    });

    // Optionally create an audit log
    if (actorId) {
      await prisma.roleChangeAudit.create({
        data: {
          tenantId,
          roleId: role.id,
          action: "CREATED",
          changedBy: actorId,
          newPermissions: JSON.stringify(permissionIds)
        }
      });
    }

    res.status(201).json(role);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Role name must be unique within the organization" });
    }
    console.error('[API Error in createRole]', error);
    res.status(500).json({ error: "Failed to create role" });
  }
};
