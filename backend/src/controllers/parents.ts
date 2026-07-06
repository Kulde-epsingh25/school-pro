import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getParents = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const parents = await prisma.parentProfile.findMany({
      where: {
        user: {
          tenantRoles: {
            some: {
              tenantId
            }
          }
        }
      },
      include: {
        user: true,
        students: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    res.json(parents);
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
};

export const createParent = async (req: Request, res: Response) => {
  const { tenantId, firstName, lastName, email, phone } = req.body;

  if (!tenantId || typeof tenantId !== 'string' || !firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create Base User
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone: phone || null,
          password: "TempPassword123!", // Should be generated and emailed
          isActive: true
        }
      });

      // Find "PARENT" role for this tenant
      let parentRole = await tx.tenantRole.findFirst({
        where: { tenantId, name: "PARENT" }
      });

      if (!parentRole) {
        // Fallback create if not exists
        parentRole = await tx.tenantRole.create({
          data: {
            tenantId,
            name: "PARENT",
            displayName: "Parent",
            description: "Default parent role",
            createdBy: user.id
          }
        });
      }

      // Assign role
      await tx.tenantUserRole.create({
        data: {
          userId: user.id,
          tenantId,
          roleId: parentRole.id,
          assignedBy: user.id
        }
      });

      // Create Parent Profile
      const parentProfile = await tx.parentProfile.create({
        data: {
          userId: user.id
        },
        include: {
          user: true
        }
      });

      return parentProfile;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating parent:", error);
    res.status(500).json({ error: "Failed to create parent" });
  }
};
