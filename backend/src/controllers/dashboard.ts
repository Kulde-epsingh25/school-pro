import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getTenantDashboardMetrics = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    // 1. Get total students, teachers, parents, classes
    const totalStudents = await prisma.studentProfile.count({
      where: {
        user: { tenantRoles: { some: { tenantId } } }
      }
    });

    const totalTeachers = await prisma.teacherProfile.count({
      where: {
        user: { tenantRoles: { some: { tenantId } } }
      }
    });

    const totalParents = await prisma.parentProfile.count({
      where: {
        user: { tenantRoles: { some: { tenantId } } }
      }
    });

    const totalClasses = await prisma.class.count({
      where: { tenantId }
    });

    // 2. Total Revenue (sum of all PAID payments)
    const payments = await prisma.payment.aggregate({
      where: { tenantId, status: "PAID" },
      _sum: { amount: true }
    });
    const totalRevenue = payments._sum.amount || 0;

    // 3. Recent Admissions (last 5 students)
    const recentStudentsRaw = await prisma.studentProfile.findMany({
      where: {
        user: { tenantRoles: { some: { tenantId } } }
      },
      include: {
        user: true
      },
      orderBy: {
        user: { createdAt: 'desc' }
      },
      take: 5
    });

    const recentAdmissions = recentStudentsRaw.map(s => ({
      customer: `${s.user.firstName} ${s.user.lastName}`,
      email: s.user.email,
      source: "Dashboard",
      status: "ENROLLED",
      date: s.user.createdAt.toISOString().split('T')[0],
      amount: "₹0" // Assuming 0 for now
    }));

    // 4. Monthly Fee Collection Data from Real Payments
    const allPaidPayments = await prisma.payment.findMany({
      where: { tenantId, status: "PAID" },
      select: { amount: true, createdAt: true }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonthIdx - i);
      last6Months.push({
        name: monthNames[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        value: 0
      });
    }

    allPaidPayments.forEach(p => {
      const pDate = new Date(p.createdAt);
      const match = last6Months.find(m => m.month === pDate.getMonth() && m.year === pDate.getFullYear());
      if (match) {
        match.value += p.amount;
      }
    });

    const feeCollectionData = last6Months.map(({ name, value }) => ({ name, value }));

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalParents,
        totalClasses,
        totalRevenue
      },
      feeCollectionData,
      recentAdmissions
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
};


