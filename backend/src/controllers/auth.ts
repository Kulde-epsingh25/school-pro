import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


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
