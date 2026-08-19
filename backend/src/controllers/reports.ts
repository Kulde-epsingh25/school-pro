import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getFinancialReport = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    // Total Revenue (Payments)
    const payments = await prisma.payment.aggregate({
      where: { tenantId, status: "PAID" },
      _sum: { amount: true }
    });
    const totalRevenue = payments._sum.amount || 0;

    // Total Operating Expenses
    const expenses = await prisma.expense.aggregate({
      where: { tenantId },
      _sum: { amount: true }
    });
    const totalExpenses = expenses._sum.amount || 0;

    // Total Salary Paid
    const payroll = await prisma.salaryPayment.aggregate({
      where: { tenantId, status: "PAID" },
      _sum: { amount: true }
    });
    const totalPayroll = payroll._sum.amount || 0;

    res.json({
      totalRevenue,
      totalExpenses,
      totalPayroll,
      netBalance: totalRevenue - totalExpenses - totalPayroll
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate financial report" });
  }
};

export const getAcademicReport = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const grades = await prisma.studentGrade.findMany({
      where: {
        exam: {
          tenantId
        }
      },
      include: {
        exam: {
          include: {
            class: true
          }
        }
      }
    });

    const subjectStats: Record<string, { total: number; count: number }> = {};
    const classStats: Record<string, { total: number; count: number }> = {};

    let overallTotal = 0;
    let overallCount = 0;

    grades.forEach(grade => {
      const g = grade.score;
      overallTotal += g;
      overallCount += 1;

      const subName = grade.exam.subject;
      if (!subjectStats[subName]) subjectStats[subName] = { total: 0, count: 0 };
      subjectStats[subName].total += g;
      subjectStats[subName].count += 1;

      const className = grade.exam.class.name;
      if (!classStats[className]) classStats[className] = { total: 0, count: 0 };
      classStats[className].total += g;
      classStats[className].count += 1;
    });

    res.json({
      overallAverage: overallCount > 0 ? (overallTotal / overallCount) : 0,
      subjectAverages: Object.entries(subjectStats).map(([name, stats]) => ({
        subject: name,
        average: stats.total / stats.count
      })),
      classAverages: Object.entries(classStats).map(([name, stats]) => ({
        class: name,
        average: stats.total / stats.count
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate academic report" });
  }
};

export const getAttendanceReport = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: { tenantId },
      include: {
        class: true,
        student: {
          include: {
            user: true
          }
        }
      }
    });

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

    const classStats: Record<string, { total: number; present: number }> = {};
    const studentStats: Record<string, { name: string; class: string; total: number; present: number }> = {};

    attendanceRecords.forEach(record => {
      // Global counts
      if (record.status === "PRESENT") presentCount++;
      else if (record.status === "ABSENT") absentCount++;
      else if (record.status === "LATE") lateCount++;
      else if (record.status === "EXCUSED") excusedCount++;

      // Class stats
      const className = record.class.name;
      if (!classStats[className]) classStats[className] = { total: 0, present: 0 };
      classStats[className].total++;
      if (record.status === "PRESENT" || record.status === "LATE") {
        classStats[className].present++;
      }

      // Student stats
      const studentId = record.studentId;
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          name: `${record.student.user.firstName} ${record.student.user.lastName}`,
          class: className,
          total: 0,
          present: 0
        };
      }
      studentStats[studentId].total++;
      if (record.status === "PRESENT" || record.status === "LATE") {
        studentStats[studentId].present++;
      }
    });

    const totalRecords = attendanceRecords.length;
    const overallPercentage = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords) * 100 : 0;

    const classAverages = Object.entries(classStats).map(([name, stats]) => ({
      class: name,
      percentage: stats.total > 0 ? (stats.present / stats.total) * 100 : 0
    }));

    const criticalStudents = Object.values(studentStats)
      .map(s => ({ ...s, percentage: s.total > 0 ? (s.present / s.total) * 100 : 0 }))
      .filter(s => s.percentage < 75 && s.total >= 5) // Only flag if <75% and at least 5 days recorded
      .sort((a, b) => a.percentage - b.percentage);

    res.json({
      summary: {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        overallPercentage
      },
      classAverages,
      criticalStudents: criticalStudents.slice(0, 50) // top 50 critical
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate attendance report" });
  }
};


