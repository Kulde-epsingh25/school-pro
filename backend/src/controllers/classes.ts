import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getClasses = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const classes = await prisma.class.findMany({
      where: { tenantId },
      include: {
        streams: {
          include: {
            _count: {
              select: { students: true }
            }
          }
        },
        _count: {
          select: { students: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const createClass = async (req: Request, res: Response) => {
  const { tenantId, name } = req.body;

  if (!tenantId || typeof tenantId !== 'string' || !name) {
    return res.status(400).json({ error: "Tenant ID and name are required" });
  }

  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        tenantId
      },
      include: {
        streams: {
          include: {
            _count: {
              select: { students: true }
            }
          }
        },
        _count: {
          select: { students: true }
        }
      }
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to create class" });
  }
};

export const createStream = async (req: Request, res: Response) => {
  const { classId, name } = req.body;

  if (!classId || !name) {
    return res.status(400).json({ error: "Class ID and name are required" });
  }

  try {
    const stream = await prisma.stream.create({
      data: {
        name,
        classId
      },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    res.status(201).json(stream);
  } catch (error) {
    console.error("Error creating stream:", error);
    res.status(500).json({ error: "Failed to create stream" });
  }
};
