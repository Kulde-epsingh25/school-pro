import { Request, Response } from "express";
import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { sendAttendanceNotificationEmail } from "../utils/email";

const prisma = new PrismaClient();

export const getAttendance = async (req: Request, res: Response) => {
  const { tenantId, classId, streamId, date } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !classId || typeof classId !== 'string' || !date || typeof date !== 'string') {
    return res.status(400).json({ error: "Tenant ID, Class ID, and Date are required" });
  }

  try {
    const targetDate = new Date(date);
    // Setting to start of day for accurate comparison
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const whereClause: any = {
      tenantId,
      classId,
      date: {
        gte: targetDate,
        lt: nextDate
      }
    };

    if (streamId && typeof streamId === 'string') {
      whereClause.streamId = streamId;
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    });

    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  const { tenantId, classId, streamId, date, records } = req.body;
  const markedBy = req.headers["x-user-id"] as string;

  if (!tenantId || !classId || !date || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: "Tenant ID, Class ID, Date, and Records array are required" });
  }

  if (!markedBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const result = await prisma.$transaction(async (tx) => {
      // First, get any existing attendance for these students on this date
      const existingAttendance = await tx.attendance.findMany({
        where: {
          tenantId,
          classId,
          studentId: {
            in: records.map((r: any) => r.studentId)
          },
          date: targetDate
        }
      });

      const existingMap = new Map(existingAttendance.map(a => [a.studentId, a.id]));
      
      const ops = [];

      for (const record of records) {
        if (!record.studentId || !record.status) continue;
        
        // Ensure status is valid
        if (!Object.values(AttendanceStatus).includes(record.status)) {
            throw new Error(`Invalid status: ${record.status}`);
        }

        const existingId = existingMap.get(record.studentId);
        
        if (existingId) {
          // Update
          ops.push(
            tx.attendance.update({
              where: { id: existingId },
              data: {
                status: record.status as AttendanceStatus,
                remarks: record.remarks,
                markedBy,
                markedAt: new Date()
              }
            })
          );
        } else {
          // Create
          ops.push(
            tx.attendance.create({
              data: {
                tenantId,
                classId,
                streamId: streamId || undefined,
                studentId: record.studentId,
                date: targetDate,
                status: record.status as AttendanceStatus,
                remarks: record.remarks,
                markedBy
              }
            })
          );
        }
      }

      await Promise.all(ops);
      return { success: true, count: ops.length };
    });

    // Handle notifications asynchronously
    const targetDateString = targetDate.toISOString().split('T')[0];
    const alertRecords = records.filter((r: any) => r.status === 'ABSENT' || r.status === 'LATE');
    
    if (alertRecords.length > 0) {
      // Fire and forget
      (async () => {
        try {
          const tenantInfo = await prisma.tenant.findUnique({ where: { id: tenantId } });
          const studentIds = alertRecords.map((r: any) => r.studentId);
          const students = await prisma.studentProfile.findMany({
            where: { id: { in: studentIds } },
            include: {
              user: true,
              parent: { include: { user: true } }
            }
          });
          
          const notifications = alertRecords.map((r: any) => {
            const student = students.find((s) => s.id === r.studentId);
            if (student?.parent?.user?.email) {
              return sendAttendanceNotificationEmail(
                student.parent.user.email,
                `${student.user.firstName} ${student.user.lastName}`,
                r.status,
                targetDateString,
                tenantInfo?.name || "School Pro"
              );
            }
            return Promise.resolve();
          });
          
          await Promise.allSettled(notifications);
        } catch (e) {
          console.error("Failed to process attendance notifications", e);
        }
      })();
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to mark attendance" });
  }
};

export const importBiometric = async (req: Request, res: Response) => {
  const { tenantId, data } = req.body;
  const markedBy = req.headers["x-user-id"] as string;

  if (!tenantId || !data || !Array.isArray(data)) {
    return res.status(400).json({ error: "Tenant ID and data array required" });
  }

  try {
    // Process biometric data to extract attendance records
    // Assuming data is an array of { studentId, date, status }
    const ops = data.map((record: any) => {
      const targetDate = new Date(record.date);
      targetDate.setHours(0, 0, 0, 0);

      return prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: targetDate
          }
        },
        update: {
          status: record.status as AttendanceStatus,
          markedBy,
          markedAt: new Date()
        },
        create: {
          tenantId,
          classId: record.classId, // Mock class ID for import
          studentId: record.studentId,
          date: targetDate,
          status: record.status as AttendanceStatus,
          markedBy
        }
      });
    });

    await prisma.$transaction(ops);
    res.json({ success: true, count: ops.length });
  } catch (error) {
    console.error("Biometric import error:", error);
    res.status(500).json({ error: "Failed to import biometric data" });
  }
};
