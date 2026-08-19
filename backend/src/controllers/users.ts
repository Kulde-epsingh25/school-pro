import { Request, Response } from "express";
import { db as prisma } from "../db";
import { TenantRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createUserSchema } from "../schemas/user";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');


export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, phone, roleId, tenantId, assignedBy } = req.body;

  try {
    const validated = createUserSchema.parse(req.body);
    const { email, firstName, lastName, phone, roleId, tenantId, assignedBy } = validated;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // 1. Create the user with pending status
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("Password123!", saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, 
        firstName,
        lastName,
        phone,
        isActive: false 
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
    console.log(`[MAGIC LINK - DEV ACCESS] To: ${email}`);
    console.log(`[MAGIC LINK] Link: ${magicLink}`);
    console.log("=========================================================");

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "School Management Pro <noreply@schoolpro.app>", // Update with verified domain if applicable
        to: email,
        subject: "Invitation to join School Management Pro",
        html: `
          <h1>Welcome to School Management Pro</h1>
          <p>Hi ${firstName},</p>
          <p>You have been invited by the Super Admin to join the system.</p>
          <p>Please click the link below to verify your account and set up your secure password:</p>
          <a href="${magicLink}" style="display:inline-block;padding:10px 20px;background:#2563EB;color:white;text-decoration:none;border-radius:5px;">Set My Password</a>
        `,
      });
      console.log(`[EMAIL SENT] Invitation email sent to ${email} via Resend.`);
    } else {
      console.log(`[MOCK EMAIL] Invitation email simulated for ${email}.`);
    }

    res.status(201).json({ 
      message: "User created and invitation sent successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: (error as any).errors });
    }
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

    // Role conflict detection logic
    const roles = await prisma.tenantRole.findMany({
      where: { id: { in: roleIds } }
    });
    const isSuperAdmin = roles.some((r: TenantRole) => r.name === "SUPER_ADMIN");
    if (isSuperAdmin && roles.length > 1) {
      return res.status(400).json({ error: "SUPER_ADMIN role cannot be combined with other roles. Please assign only SUPER_ADMIN." });
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

export const getMyTenants = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const userId = user.id;

    // A user can be in a tenant via TenantUserRole or TenantSuperAdmin
    const [roles, superAdmins] = await Promise.all([
      prisma.tenantUserRole.findMany({
        where: { userId },
        include: { tenant: true }
      }),
      prisma.tenantSuperAdmin.findMany({
        where: { userId },
        include: { tenant: true }
      })
    ]);

    const tenantMap = new Map();
    
    roles.forEach(r => {
      if (r.tenant) tenantMap.set(r.tenantId, r.tenant);
    });

    superAdmins.forEach(sa => {
      if (sa.tenant) tenantMap.set(sa.tenantId, sa.tenant);
    });

    res.status(200).json(Array.from(tenantMap.values()));
  } catch (error) {
    console.error('[API Error in getMyTenants]', error);
    res.status(500).json({ error: "Failed to fetch user tenants" });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  const { tenantId, roleName } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  if (!roleName || typeof roleName !== 'string') {
    return res.status(400).json({ error: "Role name is required" });
  }

  try {
    const users = await prisma.tenantUserRole.findMany({
      where: { 
        tenantId,
        role: { name: roleName.toUpperCase() }
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        }
      }
    });

    res.status(200).json(users.map(u => u.user));
  } catch (error) {
    console.error('[API Error in getUsersByRole]', error);
    res.status(500).json({ error: "Failed to fetch users by role" });
  }
};

