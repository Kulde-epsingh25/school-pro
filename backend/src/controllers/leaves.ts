import { Request, Response } from "express";
import { db as prisma } from "../db";
import { LeaveStatus } from "@prisma/client";

export const getLeaveBalance = async (req: Request, res: Response) => {
  const { tenantId, userId } = req.query;

  if (!tenantId || !userId || typeof tenantId !== 'string' || typeof userId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and User ID are required" });
  }

  try {
    // Mock balances based on leave usage
    const applications = await prisma.leaveApplication.findMany({
      where: { tenantId, userId, status: "APPROVED" }
    });

    const usedCasual = applications.filter(a => a.type === "CASUAL").length;
    const usedSick = applications.filter(a => a.type === "SICK").length;

    res.json({
      casual: Math.max(0, 10 - usedCasual),
      sick: Math.max(0, 5 - usedSick),
      unpaid: 99
    });
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    res.status(500).json({ error: "Failed to fetch leave balance" });
  }
};

export const applyLeave = async (req: Request, res: Response) => {
  const { tenantId, userId, type, startDate, endDate, reason } = req.body;

  if (!tenantId || !userId || !type || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const application = await prisma.leaveApplication.create({
      data: {
        tenantId,
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || "",
        status: "PENDING"
      }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ error: "Failed to apply for leave" });
  }
};

export const approveLeave = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tenantId, status, comments } = req.body;
  const approverId = ((req as any).user?.id || "");

  if (!id || !tenantId || !status || !approverId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updated = await prisma.leaveApplication.update({
      where: { id, tenantId },
      data: { status: status as LeaveStatus }
    });

    await prisma.leaveApproval.create({
      data: {
        leaveId: id,
        approverId,
        status: status as LeaveStatus,
        comments
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error approving leave:", error);
    res.status(500).json({ error: "Failed to approve leave" });
  }
};

export const getLeaveApplications = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const applications = await prisma.leaveApplication.findMany({
      where: { tenantId },
      include: {
        user: true,
        approvals: { include: { approver: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch leave applications" });
  }
};


