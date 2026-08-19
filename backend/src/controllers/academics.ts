import { Request, Response } from "express";
import { db as prisma } from "../db";
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling

export const getTerms = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const terms = await prisma.term.findMany({
      where: { tenantId },
      orderBy: { year: "desc" }
    });
    res.json(terms);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed to fetch terms" });
  }
};

export const createTerm = async (req: Request, res: Response) => {
  const { name, year, startDate, endDate, isActive, tenantId } = req.body;
  
  if (!tenantId) return res.status(400).json({ error: "Tenant ID required" });

  try {
    if (isActive) {
      await prisma.term.updateMany({
        where: { tenantId },
        data: { isActive: false }
      });
    }

    const term = await prisma.term.create({
      data: {
        name,
        year: parseInt(year),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        tenantId
      }
    });
    res.json(term);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed to create term" });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const depts = await prisma.department.findMany({
      where: { tenantId },
      include: { subjects: true }
    });
    res.json(depts);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, tenantId } = req.body;
  if (!tenantId) return res.status(400).json({ error: "Tenant ID required" });

  try {
    const dept = await prisma.department.create({
      data: { name, tenantId }
    });
    res.json(dept);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const dept = await prisma.department.findFirst({
      where: { id, tenantId },
      include: { subjects: true }
    });
    if (!dept) return res.status(404).json({ error: "Department not found" });
    res.json(dept);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { name } = req.body;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const dept = await prisma.department.updateMany({
      where: { id, tenantId },
      data: { name }
    });
    if (dept.count === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department updated successfully" });
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { id } = req.params;
  if (!tenantId || typeof tenantId !== 'string') return res.status(400).json({ error: "Tenant ID required" });

  try {
    const dept = await prisma.department.deleteMany({
      where: { id, tenantId }
    });
    if (dept.count === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { department: true }
    });
    res.json(subjects);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = await prisma.subject.create({
      data: {
        name: req.body.name,
        code: req.body.code,
        departmentId: req.body.departmentId
      }
    });
    res.json(subject);
  } catch (error) {
    console.error('[API Error in academics.ts]', error);
    res.status(500).json({ error: "Failed" });
  }
};


