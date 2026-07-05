import { Request, Response } from "express";
import { db } from "../db";

export async function getPlatformUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      include: {
        tenantRoles: {
          include: {
            tenant: true,
            role: true
          }
        },
        tenantSuperAdmin: {
          include: { tenant: true }
        },
        saasSuperAdmin: true
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedUsers = users.map((user: any) => {
      // Flattening the tenant/roles for the platform view
      const primaryTenant = user.tenantRoles[0]?.tenant || user.tenantSuperAdmin?.tenant;
      
      let roles: string[] = [];
      if (user.saasSuperAdmin) roles.push("SAAS_SUPER_ADMIN");
      if (user.tenantSuperAdmin) roles.push("SUPER_ADMIN");
      
      if (user.tenantRoles.length > 0) {
        roles.push(...user.tenantRoles.map((r: any) => r.role.name));
      }

      if (roles.length === 0) roles.push("USER");

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        tenant: primaryTenant ? primaryTenant.name : "System",
        roles: [...new Set(roles)],
        status: user.isActive ? "Active" : "Inactive"
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch platform users" });
  }
}
