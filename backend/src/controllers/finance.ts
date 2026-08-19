import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getFees = async (req: Request, res: Response) => {
  const { tenantId, classId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause: any = { tenantId };
    if (classId && typeof classId === 'string') {
      whereClause.classId = classId;
    }

    const fees = await prisma.fee.findMany({
      where: whereClause,
      include: {
        class: true,
        term: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
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
  const { tenantId, classId, termId, items } = req.body;
  const createdBy = ((req as any).user?.id || "");

  if (!tenantId || !classId || !termId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!createdBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const fee = await prisma.fee.create({
      data: {
        tenantId,
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
    res.status(201).json(fee);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to create fee" });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { tenantId },
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
  const { tenantId, studentId, amount, status, description } = req.body;
  const recordedBy = ((req as any).user?.id || "");

  if (!tenantId || !studentId || amount === undefined || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!recordedBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    // Generate a unique PRN (Payment Reference Number)
    const prn = "PRN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const payment = await prisma.payment.create({
      data: {
        tenantId,
        studentId,
        amount: parseFloat(amount),
        status,
        description,
        prn
      }
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const getStudentPayments = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { studentId } = req.params;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { tenantId, studentId },
      orderBy: { createdAt: "desc" }
    });
    res.json(payments);
  } catch (error) {
    console.error('[API Error in finance.ts]', error);
    res.status(500).json({ error: "Failed to fetch student payments" });
  }
};

export const getPayroll = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const payroll = await prisma.salaryPayment.findMany({
      where: { tenantId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
};

export const createSalaryPayment = async (req: Request, res: Response) => {
  const { tenantId, userId, amount, month, year, status } = req.body;
  if (!tenantId || !userId || amount === undefined || !month || !year || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payment = await prisma.salaryPayment.create({
      data: {
        tenantId,
        userId,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
        status
      }
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create salary payment" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const expenses = await prisma.expense.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const { tenantId, title, amount, category, date } = req.body;
  if (!tenantId || !title || amount === undefined || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        tenantId,
        title,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date()
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
};


