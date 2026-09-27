import { Request, Response } from "express";
import { db } from "../db";

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const totalTenants = await db.tenant.count();
    const totalUsers = await db.user.count({ where: { isActive: true } });
    
    // Simulate revenue by summing up active subscriptions
    const activeSubs = await db.subscription.findMany({
      where: { status: "ACTIVE" }
    });
    const monthlyRevenue = activeSubs.reduce((acc: number, sub: any) => acc + sub.amount, 0);

    const recentLogs = await db.tenantAuditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    // Real cumulative platform growth by month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const growthData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const tenantsCount = await db.tenant.count({
        where: { createdAt: { lte: endOfMonth } }
      });
      const usersCount = await db.user.count({
        where: { isActive: true, createdAt: { lte: endOfMonth } }
      });

      growthData.push({
        name: monthNames[d.getMonth()],
        tenants: tenantsCount,
        users: usersCount
      });
    }

    res.json({
      metrics: {
        totalTenants,
        totalUsers,
        monthlyRevenue,
        systemHealth: "99.9%"
      },
      recentLogs,
      growthData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics metrics" });
  }
}

export async function getStudentPerformance(req: Request, res: Response) {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const grades = await db.studentGrade.findMany({
      where: { tenantId },
      include: { exam: true }
    });

    const performanceBySubject: Record<string, { total: number, count: number }> = {};
    const trends: Record<string, number> = {};

    grades.forEach(g => {
      const subj = g.exam.subject;
      if (!performanceBySubject[subj]) performanceBySubject[subj] = { total: 0, count: 0 };
      performanceBySubject[subj].total += g.score;
      performanceBySubject[subj].count += 1;

      const month = g.exam.date.toLocaleString('default', { month: 'short' });
      trends[month] = (trends[month] || 0) + (g.score / g.exam.maxScore) * 100;
    });

    const subjectAverages = Object.keys(performanceBySubject).map(subj => ({
      subject: subj,
      average: performanceBySubject[subj].total / performanceBySubject[subj].count
    }));

    const trendData = Object.keys(trends).map(month => ({
      name: month,
      score: trends[month] / grades.filter(g => g.exam.date.toLocaleString('default', { month: 'short' }) === month).length
    }));

    res.json({ subjectAverages, trendData });
  } catch (error) {
    console.error("[API Error getStudentPerformance]", error);
    res.status(500).json({ error: "Failed to fetch student performance analytics" });
  }
}

export async function getAttendanceTrends(req: Request, res: Response) {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const attendance = await db.attendance.findMany({
      where: { tenantId }
    });

    const trends: Record<string, { present: number, absent: number }> = {};
    attendance.forEach(a => {
      const month = a.date.toLocaleString('default', { month: 'short' });
      if (!trends[month]) trends[month] = { present: 0, absent: 0 };
      if (a.status === 'PRESENT') trends[month].present++;
      else trends[month].absent++;
    });

    const trendData = Object.keys(trends).map(month => ({
      name: month,
      presentRate: (trends[month].present / (trends[month].present + trends[month].absent)) * 100 || 0
    }));

    res.json({ trendData });
  } catch (error) {
    console.error("[API Error getAttendanceTrends]", error);
    res.status(500).json({ error: "Failed to fetch attendance trends" });
  }
}

export async function getFinancialSummary(req: Request, res: Response) {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const feePayments = await db.payment.findMany({ where: { tenantId, status: "PAID" } });
    const payments = await db.salaryPayment.findMany({ where: { tenantId, status: "PAID" } });
    const expenses = await db.expense.findMany({ where: { tenantId } });

    const revenueByMonth: Record<string, number> = {};
    const expensesByMonth: Record<string, number> = {};

    feePayments.forEach(p => {
      const month = p.createdAt.toLocaleString('default', { month: 'short' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
    });

    expenses.forEach(e => {
      const month = e.date.toLocaleString('default', { month: 'short' });
      expensesByMonth[month] = (expensesByMonth[month] || 0) + e.amount;
    });

    payments.forEach(p => {
      const month = new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' });
      expensesByMonth[month] = (expensesByMonth[month] || 0) + p.amount;
    });

    const months = Array.from(new Set([...Object.keys(revenueByMonth), ...Object.keys(expensesByMonth)]));
    const data = months.map(m => ({
      name: m,
      revenue: revenueByMonth[m] || 0,
      expenses: expensesByMonth[m] || 0
    }));

    res.json({ financialData: data });
  } catch (error) {
    console.error("[API Error getFinancialSummary]", error);
    res.status(500).json({ error: "Failed to fetch financial summary" });
  }
}

