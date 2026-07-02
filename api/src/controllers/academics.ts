import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling

export const getTerms = async (req: Request, res: Response) => {
  try {
    const terms = await prisma.term.findMany({
      where: { tenantId: DUMMY_TENANT_ID },
      orderBy: { year: "desc" }
    });
    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch terms" });
  }
};

export const createTerm = async (req: Request, res: Response) => {
  const { name, year, startDate, endDate, isActive } = req.body;
  try {
    // Basic tenant provision for dummy
    const tenant = await prisma.tenant.upsert({
      where: { id: DUMMY_TENANT_ID },
      update: {},
      create: { id: DUMMY_TENANT_ID, name: "Default College" }
    });

    if (isActive) {
      await prisma.term.updateMany({
        where: { tenantId: DUMMY_TENANT_ID },
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
        tenantId: tenant.id
      }
    });
    res.json(term);
  } catch (error) {
    res.status(500).json({ error: "Failed to create term" });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const depts = await prisma.department.findMany({
      where: { tenantId: DUMMY_TENANT_ID },
      include: { subjects: true }
    });
    res.json(depts);
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const dept = await prisma.department.create({
      data: { name: req.body.name, tenantId: DUMMY_TENANT_ID }
    });
    res.json(dept);
  } catch (error) {
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
    res.status(500).json({ error: "Failed" });
  }
};
