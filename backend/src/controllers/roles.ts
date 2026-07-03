import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_ROLES = [
  { name: "SUPER_ADMIN", description: "Full access to the system" },
  { name: "FINANCE_ADMIN", description: "Access to finance and fee modules" },
  { name: "ACADEMIC_ADMIN", description: "Access to academic and timetable modules" },
  { name: "TEACHER", description: "Access to specific classes and students" },
  { name: "STAFF", description: "General staff access" }
];

export const getRoles = async (req: Request, res: Response) => {
  try {
    // Auto-seed logic: Check if roles exist, if not create them
    const existingRolesCount = await prisma.role.count();
    
    if (existingRolesCount === 0) {
      console.log("No roles found in DB. Seeding default roles...");
      await prisma.role.createMany({
        data: DEFAULT_ROLES
      });
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error('[API Error in getRoles]', error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};
