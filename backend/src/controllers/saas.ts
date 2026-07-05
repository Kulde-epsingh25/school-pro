import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const totalTenants = await prisma.tenant.count();
    const totalUsers = await prisma.user.count({ where: { isActive: true } });
    const activeSubs = await prisma.subscription.count({ where: { status: "ACTIVE" } });

    res.json({
      totalTenants,
      totalUsers,
      activeSubs,
      systemHealth: "99.9%"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        subscription: true,
        _count: {
          select: { tenantUserRoles: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
};
