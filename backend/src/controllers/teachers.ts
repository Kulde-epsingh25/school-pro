import { Request, Response } from "express";
import { db as prisma } from "../db";
import bcrypt from "bcryptjs";


export const getTeachers = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const teachers = await prisma.user.findMany({
      where: {
        tenantRoles: {
          some: {
            tenantId,
            role: {
              name: "TEACHER"
            }
          }
        }
      },
      include: {
        teacherProfile: true
      }
    });
    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  const { tenantId, firstName, lastName, email, phone, gender, dob, employeeId, joiningDate, designation, department, subjects, classes } = req.body;
  const assignedBy = ((req as any).user?.id || "");

  if (!tenantId || !firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find role TEACHER
      const role = await tx.tenantRole.findFirst({
        where: { tenantId, name: "TEACHER" }
      });

      if (!role) {
        throw new Error("Teacher role not found for this tenant");
      }

      // Check existing user
      let user = await tx.user.findUnique({
        where: { email }
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash("Password123!", 10);
        user = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            isActive: true
          }
        });
      }

      // Create mapping
      await tx.tenantUserRole.create({
        data: {
          userId: user.id,
          tenantId,
          roleId: role.id,
          assignedBy: assignedBy || user.id
        }
      });

      // Create Profile
      const profile = await tx.teacherProfile.create({
        data: {
          userId: user.id
        }
      });

      return { user, profile };
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ error: error.message || "Failed to create teacher" });
  }
};

