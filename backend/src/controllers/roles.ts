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

export const getRole = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const role = await prisma.tenantRole.findFirst({
      where: { id, tenantId },
      include: {
        permissions: {
          include: { permission: true }
        },
        _count: {
          select: { userRoles: true }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error('[API Error in getRole]', error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { name, displayName, description, color, permissionIds } = req.body;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const user = (req as any).user;
    const actorId = user ? user.id : null;

    // Check if role exists and belongs to tenant
    const existingRole = await prisma.tenantRole.findFirst({
      where: { id, tenantId },
      include: { permissions: true }
    });

    if (!existingRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Update role and its permissions
    const updatedRole = await prisma.$transaction(async (prisma) => {
      // 1. Delete existing permissions
      await prisma.tenantRolePermission.deleteMany({
        where: { roleId: id }
      });

      // 2. Update role details and add new permissions
      return await prisma.tenantRole.update({
        where: { id },
        data: {
          ...(name && { name: name.toUpperCase().replace(/\s+/g, '_') }),
          ...(displayName && { displayName }),
          ...(description !== undefined && { description }),
          ...(color !== undefined && { color }),
          permissions: {
            create: (permissionIds || []).map((permId: string) => ({
              permissionId: permId
            }))
          }
        },
        include: {
          permissions: { include: { permission: true } }
        }
      });
    });

    if (actorId) {
      await prisma.roleChangeAudit.create({
        data: {
          tenantId,
          roleId: id,
          action: "UPDATED",
          changedBy: actorId,
          previousPermissions: JSON.stringify(existingRole.permissions.map(p => p.permissionId)),
          newPermissions: JSON.stringify(permissionIds || [])
        }
      });
    }

    res.status(200).json(updatedRole);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Role name must be unique within the organization" });
    }
    console.error('[API Error in updateRole]', error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const user = (req as any).user;
    const actorId = user ? user.id : null;

    const existingRole = await prisma.tenantRole.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: { userRoles: true }
        }
      }
    });

    if (!existingRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (existingRole._count.userRoles > 0) {
      return res.status(400).json({ error: "Cannot delete role because it is currently assigned to users" });
    }

    await prisma.tenantRole.delete({
      where: { id }
    });

    if (actorId) {
      await prisma.roleChangeAudit.create({
        data: {
          tenantId,
          roleId: id,
          action: "DELETED",
          changedBy: actorId,
          previousPermissions: JSON.stringify([])
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('[API Error in deleteRole]', error);
    res.status(500).json({ error: "Failed to delete role" });
  }
};
