import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, phone, roleId, tenantId } = req.body;

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

    // 2. Map User to Tenant
    const userTenant = await prisma.userTenant.create({
      data: {
        userId: user.id,
        tenantId
      }
    });

    // 3. Assign Role if provided
    if (roleId) {
      await prisma.userRole.create({
        data: {
          userTenantId: userTenant.id,
          roleId
        }
      });
    }

    // 4. Generate the "Magic Link" token
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
