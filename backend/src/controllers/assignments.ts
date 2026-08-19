import { Request, Response } from "express";
import { db as prisma } from "../db";`nimport { SubmissionStatus } from "@prisma/client";

export const getAssignments = async (req: Request, res: Response) => {
  const { tenantId, classId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause: any = { tenantId };
    if (classId && typeof classId === 'string') {
      whereClause.classId = classId;
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      orderBy: { dueDate: 'asc' },
      include: {
        class: true
      }
    });

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  const { tenantId, title, description, dueDate, classId, subject, maxScore } = req.body;
  const createdBy = ((req as any).user?.id || "");

  if (!tenantId || !title || !dueDate || !classId || !subject || maxScore === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!createdBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        tenantId,
        title,
        description,
        dueDate: new Date(dueDate),
        classId,
        subject,
        maxScore: Number(maxScore),
        createdBy
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tenantId } = req.query;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { class: true }
    });

    if (!assignment || (tenantId && assignment.tenantId !== tenantId)) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  const { tenantId, assignmentId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !assignmentId || typeof assignmentId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and Assignment ID are required" });
  }

  try {
    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        tenantId,
        assignmentId
      }
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const gradeSubmissions = async (req: Request, res: Response) => {
  const { tenantId, assignmentId, records } = req.body;
  const gradedBy = ((req as any).user?.id || "");

  if (!tenantId || !assignmentId || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: "Tenant ID, Assignment ID, and Records array are required" });
  }

  if (!gradedBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingSubmissions = await tx.assignmentSubmission.findMany({
        where: {
          tenantId,
          assignmentId,
          studentId: {
            in: records.map((r: any) => r.studentId)
          }
        }
      });

      const existingMap = new Map(existingSubmissions.map(s => [s.studentId, s.id]));
      
      const ops = [];

      for (const record of records) {
        if (!record.studentId || record.score === undefined) continue;
        
        const existingId = existingMap.get(record.studentId);
        
        const score = Number(record.score);
        const status = SubmissionStatus.GRADED;

        if (existingId) {
          ops.push(
            tx.assignmentSubmission.update({
              where: { id: existingId },
              data: {
                score,
                feedback: record.feedback,
                status,
                gradedBy,
                gradedAt: new Date()
              }
            })
          );
        } else {
          // If the student never officially "submitted", the teacher can still grade them (e.g. physical hand-in)
          ops.push(
            tx.assignmentSubmission.create({
              data: {
                tenantId,
                assignmentId,
                studentId: record.studentId,
                score,
                feedback: record.feedback,
                status,
                gradedBy,
                gradedAt: new Date()
              }
            })
          );
        }
      }

      await Promise.all(ops);
      return { success: true, count: ops.length };
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error saving grades:", error);
    res.status(500).json({ error: error.message || "Failed to save assignment grades" });
  }
};

export const getStudentAssignments = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = ((req as any).user?.id || "");

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  if (!userId) {
    return res.status(401).json({ error: "User ID is required" });
  }

  try {
    // 1. Find the student profile to get classId
    const student = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!student || !student.classId) {
      return res.status(404).json({ error: "Student profile or class not found" });
    }

    // 2. Fetch assignments for that class, including their specific submissions
    const assignments = await prisma.assignment.findMany({
      where: {
        tenantId,
        classId: student.classId
      },
      include: {
        class: true,
        submissions: {
          where: { studentId: student.id }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    res.status(500).json({ error: "Failed to fetch student assignments" });
  }
};

export const submitAssignment = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { assignmentId } = req.params;
  const { content } = req.body;
  const userId = ((req as any).user?.id || "");

  if (!tenantId || typeof tenantId !== 'string' || !assignmentId) {
    return res.status(400).json({ error: "Tenant ID and Assignment ID are required" });
  }

  if (!userId) {
    return res.status(401).json({ error: "User ID is required" });
  }

  try {
    // 1. Find the student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // 2. Create or Update the submission
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id
        }
      },
      create: {
        tenantId,
        assignmentId,
        studentId: student.id,
        content,
        status: 'SUBMITTED',
        submittedAt: new Date()
      },
      update: {
        content,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    res.status(200).json(submission);
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ error: "Failed to submit assignment" });
  }
};



