import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStudents = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const students = await prisma.studentProfile.findMany({
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
        class: true,
        stream: true
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  const { tenantId, firstName, lastName, email, gender, dob, classId, streamId, parentId } = req.body;

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
          password: "TempPassword123!", // Should be generated and emailed
          isActive: true
        }
      });

      // Find "STUDENT" role for this tenant
      let studentRole = await tx.tenantRole.findFirst({
        where: { tenantId, name: "STUDENT" }
      });

      if (!studentRole) {
        // Fallback create if not exists
        studentRole = await tx.tenantRole.create({
          data: {
            tenantId,
            name: "STUDENT",
            displayName: "Student",
            description: "Default student role",
            createdBy: user.id
          }
        });
      }

      // Assign role
      await tx.tenantUserRole.create({
        data: {
          userId: user.id,
          tenantId,
          roleId: studentRole.id,
          assignedBy: user.id
        }
      });

      // Create Student Profile
      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          gender,
          dob: dob ? new Date(dob) : null,
          classId: classId || null,
          streamId: streamId || null,
          parentId: parentId || null
        },
        include: {
          user: true,
          class: true,
          stream: true
        }
      });

      return studentProfile;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};
