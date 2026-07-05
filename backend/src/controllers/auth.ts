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
        saasSuperAdmin: true,
        tenantSuperAdmin: true,
        tenantRoles: {
          include: {
            role: true,
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
    let roles: string[] = [];
    let schoolId: string | undefined = undefined;
    let schoolName: string | undefined = undefined;

    if (user.saasSuperAdmin) {
      roles.push("saas_super_admin");
    }

    if (user.tenantSuperAdmin) {
      // By definition a tenant super admin has super_admin rights for their tenant
      roles.push("super_admin");
      schoolId = user.tenantSuperAdmin.tenantId;
      // Note: to get the name we'd need to fetch the tenant or include it in tenantSuperAdmin. 
      // For now, if they also have a tenantRole, we can extract the name from there.
    }

    const userTenant = user.tenantRoles[0];
    if (userTenant) {
      roles.push(userTenant.role.name.toLowerCase());
      schoolId = userTenant.tenant.id;
      schoolName = userTenant.tenant.name;
    }

    // De-duplicate roles
    roles = [...new Set(roles)];

    const mockAccessToken = "live_access_token_" + Date.now();
    const mockRefreshToken = "live_refresh_token_" + Date.now();

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roles: roles,
        schoolId: schoolId,
        schoolName: schoolName
      },
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken
    });

  } catch (error) {
    console.error('[API Error in auth.ts]', error);
    res.status(500).json({ error: "Failed to login" });
  }
};
