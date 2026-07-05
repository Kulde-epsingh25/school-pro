import { Request, Response } from "express";
import { prisma } from "../db";

export async function getPlatformUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenants: {
          include: {
            tenant: true,
            roles: {
              include: {
                role: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedUsers = users.map(user => {
      // Flattening the tenant/roles for the platform view
      // Just taking the first tenant for simplicity of the table view, though a user can have many
      const primaryTenant = user.tenants[0];
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        tenant: primaryTenant ? primaryTenant.tenant.name : "System",
        roles: primaryTenant ? primaryTenant.roles.map(r => r.role.name) : ["USER"],
        status: user.isActive ? "Active" : "Inactive"
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch platform users" });
  }
}
