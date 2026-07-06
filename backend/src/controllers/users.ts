import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, phone, roleId, tenantId, assignedBy } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // 1. Create the user with pending status
    const user = await prisma.user.create({
      data: {
        email,
        password: "Password123!", // DEBUG: Bypassing email verification for now
        firstName,
        lastName,
        phone,
        isActive: true // DEBUG: Auto-activating account
      }
    });

    // 2. Map User to Tenant Role
    if (roleId && tenantId) {
      await prisma.tenantUserRole.create({
        data: {
          userId: user.id,
          tenantId,
          roleId,
          assignedBy: assignedBy || user.id // Default to self if not provided
        }
      });
    }

    // 3. Generate the "Magic Link" token
    const verificationToken = Buffer.from(`${user.id}:${tenantId}`).toString('base64');
    const magicLink = `https://school-pro-mocha-beta.vercel.app/auth/verify?token=${verificationToken}`;

    console.log("=========================================================");
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Subject: Invitation to join School Management Pro`);
    console.log(`[MOCK EMAIL] Body: You have been invited by the Super Admin to join the system. Please verify your account and set your password:`);
    console.log(`[MOCK EMAIL] Link: ${magicLink}`);
    console.log("=========================================================");

    res.status(201).json({ 
      message: "User created and invitation sent successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('[API Error in createUser (users.ts)]', error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const userRoles = await prisma.tenantUserRole.findMany({
      where: { tenantId },
      include: {
        user: true,
        role: true
      }
    });

    // A user might have multiple roles, so let's group them by user
    const userMap = new Map();

    for (const ur of userRoles) {
      if (!userMap.has(ur.user.id)) {
        userMap.set(ur.user.id, {
          id: ur.user.id,
          firstName: ur.user.firstName,
          lastName: ur.user.lastName,
          email: ur.user.email,
          phone: ur.user.phone,
          isActive: ur.user.isActive,
          roles: []
        });
      }
      userMap.get(ur.user.id).roles.push({ id: ur.role.id, name: ur.role.name });
    }

    const formattedUsers = Array.from(userMap.values());

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('[API Error in getUsers]', error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const userRole = await prisma.tenantUserRole.findFirst({
      where: { tenantId, userId: id },
    });

    if (!userRole) {
      return res.status(404).json({ error: "User not found in this tenant" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tenantRoles: {
          where: { tenantId },
          include: { role: true }
        }
      }
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('[API Error in getUser]', error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { firstName, lastName, phone } = req.body;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    // Verify user belongs to tenant
    const userRole = await prisma.tenantUserRole.findFirst({
      where: { tenantId, userId: id },
    });

    if (!userRole) {
      return res.status(404).json({ error: "User not found in this tenant" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('[API Error in updateUser]', error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const updateUserRoles = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { roleIds } = req.body; // Array of role IDs

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  if (!Array.isArray(roleIds)) {
    return res.status(400).json({ error: "roleIds must be an array" });
  }

  try {
    const user = (req as any).user;
    const assignedBy = user ? user.id : id;

    // Verify user exists globally (could be a new invite to tenant)
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.$transaction(async (prisma) => {
      // Remove all existing roles for this user in this tenant
      await prisma.tenantUserRole.deleteMany({
        where: { tenantId, userId: id }
      });

      // Add new roles
      if (roleIds.length > 0) {
        await prisma.tenantUserRole.createMany({
          data: roleIds.map((roleId: string) => ({
            tenantId,
            userId: id,
            roleId,
            assignedBy
          }))
        });
      }
    });

    res.status(200).json({ message: "User roles updated successfully" });
  } catch (error) {
    console.error('[API Error in updateUserRoles]', error);
    res.status(500).json({ error: "Failed to update user roles" });
  }
};

export const removeUserFromTenant = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    // Remove all roles for this user in this tenant, effectively revoking access
    const result = await prisma.tenantUserRole.deleteMany({
      where: { tenantId, userId: id }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "User not found in this tenant" });
    }

    res.status(204).send();
  } catch (error) {
    console.error('[API Error in removeUserFromTenant]', error);
    res.status(500).json({ error: "Failed to remove user from tenant" });
  }
};
