import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling

export const getFees = async (req: Request, res: Response) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { tenantId: DUMMY_TENANT_ID },
      include: {
        class: true,
        term: true,
        items: true
      }
    });
    
    const formatted = fees.map(f => ({
      ...f,
      totalAmount: f.items.reduce((sum, item) => sum + item.amount, 0)
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
};

export const createFee = async (req: Request, res: Response) => {
  const { classId, termId, items } = req.body;
  try {
    const tenant = await prisma.tenant.upsert({
      where: { id: DUMMY_TENANT_ID },
      update: {},
      create: { id: DUMMY_TENANT_ID, name: "Default College" }
    });

    const fee = await prisma.fee.create({
      data: {
        tenantId: tenant.id,
        classId,
        termId,
        items: {
          create: items.map((i: any) => ({
            title: i.title,
            amount: parseFloat(i.amount)
          }))
        }
      }
    });
    res.json(fee);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to create fee" });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: {
          include: { class: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(payments);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  const { studentId, amount, status, description } = req.body;
  try {
    const prn = "PRN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        status,
        description,
        prn
      }
    });
    res.json(payment);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const getStudentPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { createdAt: "desc" }
    });
    res.json(payments);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to fetch student payments" });
  }
};
