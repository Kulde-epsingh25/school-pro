import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getGrades = async (req: Request, res: Response) => {
  const { tenantId, examId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !examId || typeof examId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and Exam ID are required" });
  }

  try {
    const grades = await prisma.studentGrade.findMany({
      where: {
        tenantId,
        examId
      }
    });

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
};

export const bulkSaveGrades = async (req: Request, res: Response) => {
  const { tenantId, examId, records } = req.body;
  const markedBy = ((req as any).user?.id || "");

  if (!tenantId || !examId || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: "Tenant ID, Exam ID, and Records array are required" });
  }

  if (!markedBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingGrades = await tx.studentGrade.findMany({
        where: {
          tenantId,
          examId,
          studentId: {
            in: records.map((r: any) => r.studentId)
          }
        }
      });

      const existingMap = new Map(existingGrades.map(g => [g.studentId, g.id]));
      
      const ops = [];

      for (const record of records) {
        if (!record.studentId || record.score === undefined) continue;
        
        const existingId = existingMap.get(record.studentId);
        
        if (existingId) {
          ops.push(
            tx.studentGrade.update({
              where: { id: existingId },
              data: {
                score: Number(record.score),
                remarks: record.remarks,
                markedBy,
                markedAt: new Date()
              }
            })
          );
        } else {
          ops.push(
            tx.studentGrade.create({
              data: {
                tenantId,
                examId,
                studentId: record.studentId,
                score: Number(record.score),
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

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error saving grades:", error);
    res.status(500).json({ error: error.message || "Failed to save grades" });
  }
};

export const getStudentReportCard = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
        stream: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const grades = await prisma.studentGrade.findMany({
      where: { studentId, tenantId },
      include: {
        exam: true
      }
    });

    // Group by subject and calculate average
    const subjectStats: Record<string, { totalScore: number; maxScore: number; exams: any[] }> = {};
    
    let totalScoreAll = 0;
    let maxScoreAll = 0;

    grades.forEach(g => {
      const subject = g.exam.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = { totalScore: 0, maxScore: 0, exams: [] };
      }
      subjectStats[subject].totalScore += g.score;
      subjectStats[subject].maxScore += g.exam.maxScore;
      subjectStats[subject].exams.push({
        examName: g.exam.name,
        date: g.exam.date,
        score: g.score,
        maxScore: g.exam.maxScore,
        remarks: g.remarks
      });

      totalScoreAll += g.score;
      maxScoreAll += g.exam.maxScore;
    });

    const getGradeLetter = (percentage: number) => {
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B';
      if (percentage >= 60) return 'C';
      if (percentage >= 50) return 'D';
      return 'F';
    };

    const subjects = Object.entries(subjectStats).map(([subject, stats]) => {
      const percentage = stats.maxScore > 0 ? (stats.totalScore / stats.maxScore) * 100 : 0;
      return {
        subject,
        totalScore: stats.totalScore,
        maxScore: stats.maxScore,
        percentage,
        gradeLetter: getGradeLetter(percentage),
        exams: stats.exams
      };
    });

    const overallPercentage = maxScoreAll > 0 ? (totalScoreAll / maxScoreAll) * 100 : 0;
    const overallGradeLetter = getGradeLetter(overallPercentage);

    res.json({
      student: {
        id: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        class: student.class?.name,
        stream: student.stream?.name
      },
      summary: {
        totalScore: totalScoreAll,
        maxScore: maxScoreAll,
        overallPercentage,
        overallGradeLetter
      },
      subjects
    });

  } catch (error) {
    console.error("Error generating report card:", error);
    res.status(500).json({ error: "Failed to generate report card" });
  }
};


