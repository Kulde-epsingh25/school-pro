import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/jwt";
import { loginSchema } from "../schemas/user";
import { z } from "zod";
import { sendVerificationEmail } from "../utils/email";
import { seedDefaultPermissions } from "../utils/tenantProvisioning";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const onboardSchool = async (req: Request, res: Response) => {
  const { schoolName, domain, adminFirstName, adminLastName, adminEmail, plan } = req.body;
  const finalDomain = domain && domain.trim() !== "" ? domain.trim() : undefined;

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: schoolName,
          domain: finalDomain,
          isMaster: true,
          subscription: {
            create: {
              plan: plan || "starter",
              status: "ACTIVE",
              billingCycle: "MONTHLY",
              amount: 99
            }
          }
        }
      });

      // 2. Create the Admin User with pending status
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: "PENDING_VERIFICATION", 
          firstName: adminFirstName,
          lastName: adminLastName,
          isActive: false
        }
      });

      // 3. Set as Tenant Super Admin
      await tx.tenantSuperAdmin.create({
        data: {
          tenantId: tenant.id,
          userId: adminUser.id
        }
      });

      return { tenant, adminUser };
    });

    // Seed permissions for the new school
    await seedDefaultPermissions(result.tenant.id, result.adminUser.id);

    // 4. Generate the "Magic Link" token
    const verificationToken = jwt.sign(
      { userId: result.adminUser.id, tenantId: result.tenant.id },
      env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    const magicLink = `https://school-pro-mocha-beta.vercel.app/auth/verify?token=${verificationToken}`;

    // 5. Send Real Email (with fallback if API key is missing)
    await sendVerificationEmail(adminEmail, magicLink, schoolName);

    res.status(201).json({ 
      message: "School onboarded successfully. Magic Link generated.",
      tenantId: result.tenant.id,
      magicLink: magicLink
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to onboard school" });
  }
};

export const setupPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    // 1. Decode and Verify Token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string, tenantId: string };
    const { userId, tenantId } = decoded;

    if (!userId || !tenantId) {
      return res.status(400).json({ error: "Invalid token structure" });
    }

    // 2. Find User
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Update Password & Activate Account
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
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
  try {
    const { email, password } = req.body;

    // 1. Find User by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        saasSuperAdmin: true,
        tenantSuperAdmin: {
          include: {
            tenant: true
          }
        },
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

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        error: "Account not verified. Check your email." 
      });
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
      schoolName = user.tenantSuperAdmin.tenant?.name;
    }

    const userTenant = user.tenantRoles[0];
    if (userTenant) {
      roles.push(userTenant.role.name.toLowerCase());
      schoolId = userTenant.tenant.id;
      schoolName = userTenant.tenant.name;
    }

    // De-duplicate roles
    roles = [...new Set(roles)];

    const { accessToken, refreshToken } = generateTokens(user.id, schoolId);

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
      accessToken: accessToken,
      refreshToken: refreshToken
    });

  } catch (error: any) {
    console.error('[API Error in auth.ts]', error);
    res.status(500).json({ error: "Failed to login" });
  }
};
