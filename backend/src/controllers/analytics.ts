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

    const recentLogs = await db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    // Mock chart data for platform growth
    const growthData = [
      { name: "Jan", tenants: Math.max(1, totalTenants - 5), users: Math.max(100, totalUsers - 500) },
      { name: "Feb", tenants: Math.max(2, totalTenants - 4), users: Math.max(200, totalUsers - 400) },
      { name: "Mar", tenants: Math.max(3, totalTenants - 3), users: Math.max(300, totalUsers - 300) },
      { name: "Apr", tenants: Math.max(4, totalTenants - 2), users: Math.max(400, totalUsers - 200) },
      { name: "May", tenants: Math.max(5, totalTenants - 1), users: Math.max(500, totalUsers - 100) },
      { name: "Jun", tenants: totalTenants, users: totalUsers },
    ];

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
