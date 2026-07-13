import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
