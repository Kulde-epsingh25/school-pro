import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const onboardSchool = async (req: Request, res: Response) => {
  const { schoolName, domain, adminFirstName, adminLastName, adminEmail } = req.body;

  try {
    // DEBUG: Print the connection string to verify Render is using the right one
    const dbUrl = process.env.DATABASE_URL || "NOT SET";
    console.log("[DEBUG] Render DATABASE_URL:", dbUrl.replace(/:[^:@]+@/, ':***@'));

    // 1. Create the Tenant (School/University)
    const tenant = await prisma.tenant.create({
      data: {
        name: schoolName,
        domain: domain || undefined,
        isMaster: true // The initial tenant is the master
      }
    });

    // 2. Create the Super Admin User
    // We set a dummy password because they haven't verified and set it yet
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: "Password123!", // DEBUG: Bypassing email verification for now
        firstName: adminFirstName,
        lastName: adminLastName,
        isActive: true // DEBUG: Auto-activating account
      }
    });

    // 3. Map User to Tenant
    await prisma.userTenant.create({
      data: {
        userId: user.id,
        tenantId: tenant.id
      }
    });

    // 4. Generate the "Magic Link" token (mocking email sending)
    // In a real app, this would be a JWT or secure token saved to the DB
    const verificationToken = Buffer.from(`${user.id}:${tenant.id}`).toString('base64');
    const magicLink = `http://localhost:3000/auth/verify?token=${verificationToken}`;

    console.log("=========================================================");
    console.log(`[MOCK EMAIL] To: ${adminEmail}`);
    console.log(`[MOCK EMAIL] Subject: Welcome to School Management Pro`);
    console.log(`[MOCK EMAIL] Body: Please verify your account and set your password:`);
    console.log(`[MOCK EMAIL] Link: ${magicLink}`);
    console.log("=========================================================");

    res.status(201).json({ 
      message: "School onboarded successfully. Check terminal for Magic Link.",
      tenantId: tenant.id
    });

  } catch (error: any) {
    console.error('[API Error in auth.ts]', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "A school with this domain or an admin with this email already exists." });
    }
    // Return the actual error message for debugging purposes
    res.status(500).json({ error: "Failed to onboard school", details: error?.message || String(error) });
  }
};

export const setupPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    // 1. Decode Token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, tenantId] = decoded.split(':');

    if (!userId || !tenantId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // 2. Find User
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Update Password & Activate Account
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: password, // In production, hash this with bcrypt!
        isActive: true
      }
    });

    res.json({ message: "Password set successfully. Account activated." });

  } catch (error) {
    console.error('[API Error in auth.ts]', error);
    console.error(error);
    res.status(500).json({ error: "Failed to setup password" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Find User by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenants: {
          include: {
            roles: {
              include: {
                role: true
              }
            },
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Verify Password (mock comparison for now, in prod use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Extract Roles and Tenant Info
    // If the user belongs to multiple tenants, we would handle tenant selection.
    // For now, assume they belong to their primary tenant (the first one) or none.
    const userTenant = user.tenants[0];
    const roles = userTenant ? userTenant.roles.map(r => r.role.name.toLowerCase()) : [];
    
    // Additional check for globally defined SUPER_ADMIN if you want, but for now it's mapped per tenant.

    const mockAccessToken = "live_access_token_" + Date.now();
    const mockRefreshToken = "live_refresh_token_" + Date.now();

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roles: roles,
        schoolId: userTenant ? userTenant.tenant.id : undefined,
        schoolName: userTenant ? userTenant.tenant.name : undefined
      },
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken
    });

  } catch (error) {
    console.error('[API Error in auth.ts]', error);
    res.status(500).json({ error: "Failed to login" });
  }
};
