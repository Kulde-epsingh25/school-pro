import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExams = async (req: Request, res: Response) => {
  const { tenantId, classId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause: any = { tenantId };
    if (classId && typeof classId === 'string') {
      whereClause.classId = classId;
    }

    const exams = await prisma.exam.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        class: true
      }
    });

    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

export const createExam = async (req: Request, res: Response) => {
  const { tenantId, name, date, classId, subject, maxScore } = req.body;
  const createdBy = req.headers["x-user-id"] as string;

  if (!tenantId || !name || !date || !classId || !subject || maxScore === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!createdBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const exam = await prisma.exam.create({
      data: {
        tenantId,
        name,
        date: new Date(date),
        classId,
        subject,
        maxScore: Number(maxScore),
        createdBy
      }
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Failed to create exam" });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { class: true }
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};
