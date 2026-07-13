import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTimetablePeriod = async (req: Request, res: Response) => {
  const { tenantId, classId, subject, teacherId, dayOfWeek, startTime, endTime } = req.body;
  
  if (!tenantId || !classId || !subject || !teacherId || dayOfWeek === undefined || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const period = await prisma.timetablePeriod.create({
      data: {
        tenantId,
        classId,
        subject,
        teacherId,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        class: true
      }
    });
    res.status(201).json(period);
  } catch (error) {
    console.error("Error creating timetable period:", error);
    res.status(500).json({ error: "Failed to create timetable period" });
  }
};

export const getClassTimetable = async (req: Request, res: Response) => {
  const { tenantId, classId } = req.query;
  
  if (!tenantId || typeof tenantId !== 'string' || !classId || typeof classId !== 'string') {
    return res.status(400).json({ error: "tenantId and classId are required" });
  }

  try {
    const timetable = await prisma.timetablePeriod.findMany({
      where: { tenantId, classId },
      include: {
        teacher: {
          include: { user: true }
        },
        class: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    res.json(timetable);
  } catch (error) {
    console.error("Error fetching class timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};

export const getTeacherTimetable = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = req.headers['x-user-id'] as string;
  
  if (!tenantId || typeof tenantId !== 'string' || !userId) {
    return res.status(400).json({ error: "tenantId and x-user-id are required" });
  }

  try {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId }
    });

    if (!teacherProfile) {
      return res.status(404).json({ error: "Teacher profile not found" });
    }

    const timetable = await prisma.timetablePeriod.findMany({
      where: { tenantId, teacherId: teacherProfile.id },
      include: {
        class: true,
        teacher: {
          include: { user: true }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    res.json(timetable);
  } catch (error) {
    console.error("Error fetching teacher timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};

export const getStudentTimetable = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = req.headers['x-user-id'] as string;
  
  if (!tenantId || typeof tenantId !== 'string' || !userId) {
    return res.status(400).json({ error: "tenantId and x-user-id are required" });
  }

  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile || !studentProfile.classId) {
      return res.status(404).json({ error: "Student profile or class not found" });
    }

    const timetable = await prisma.timetablePeriod.findMany({
      where: { tenantId, classId: studentProfile.classId },
      include: {
        teacher: {
          include: { user: true }
        },
        class: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    res.json(timetable);
  } catch (error) {
    console.error("Error fetching student timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};
