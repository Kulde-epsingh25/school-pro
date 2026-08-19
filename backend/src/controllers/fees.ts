import { Request, Response } from "express";
import { db as prisma } from "../db";`nimport { PaymentMethod } from "@prisma/client";

export const getMyFees = async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !studentId || typeof studentId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and Student ID required" });
  }

  try {
    const fees = await prisma.studentFee.findMany({
      where: { tenantId, studentId },
      include: {
        payments: true,
        scholarship: true
      },
      orderBy: { dueDate: "asc" }
    });

    res.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
};

export const getOutstandingFees = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const outstanding = await prisma.studentFee.findMany({
      where: { 
        tenantId,
        isPaid: false
      },
      include: {
        student: { include: { user: true } },
        payments: true,
        scholarship: true
      },
      orderBy: { dueDate: "asc" }
    });

    res.json(outstanding);
  } catch (error) {
    console.error("Error fetching outstanding fees:", error);
    res.status(500).json({ error: "Failed to fetch outstanding fees" });
  }
};

export const recordPayment = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { feeId, amount, method, reference } = req.body;
  const recordedBy = ((req as any).user?.id || "");

  if (!tenantId || !feeId || !amount || !method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const fee = await prisma.studentFee.findUnique({
      where: { id: feeId },
      include: { payments: true, scholarship: true }
    });

    if (!fee || fee.tenantId !== tenantId) {
      return res.status(404).json({ error: "Fee not found" });
    }

    // Calculate total paid so far
    const totalPaid = fee.payments.reduce((acc, p) => acc + p.amount, 0);
    const concession = fee.scholarship?.amount || 0;
    const remaining = fee.amount - concession - totalPaid;

    if (amount > remaining) {
      return res.status(400).json({ error: `Amount exceeds remaining balance of ${remaining}` });
    }

    const payment = await prisma.feePayment.create({
      data: {
        feeId,
        amount,
        method: method as PaymentMethod,
        reference,
        recordedBy: recordedBy || "system"
      }
    });

    // Check if fully paid now
    if (totalPaid + amount >= fee.amount - concession) {
      await prisma.studentFee.update({
        where: { id: feeId },
        data: { isPaid: true }
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ error: "Failed to record payment" });
  }
};

export const applyScholarship = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { amount, reason } = req.body;
  const approvedBy = ((req as any).user?.id || "");

  try {
    const scholarship = await prisma.scholarship.create({
      data: {
        feeId: id,
        amount,
        reason,
        approvedBy: approvedBy || "system"
      }
    });
    
    // Check if scholarship covers the rest
    const fee = await prisma.studentFee.findUnique({
      where: { id },
      include: { payments: true }
    });
    
    if (fee) {
      const totalPaid = fee.payments.reduce((acc, p) => acc + p.amount, 0);
      if (totalPaid + amount >= fee.amount) {
        await prisma.studentFee.update({
          where: { id },
          data: { isPaid: true }
        });
      }
    }

    res.status(201).json(scholarship);
  } catch (error) {
    console.error("Error applying scholarship:", error);
    res.status(500).json({ error: "Failed to apply scholarship" });
  }
};


