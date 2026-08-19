import { Request, Response } from "express";
import { db as prisma } from "../db";
import { AnnouncementRole } from "@prisma/client";

export const getAnnouncements = async (req: Request, res: Response) => {
  const { tenantId, role } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  try {
    const whereClause: any = { tenantId };
    
    // If a specific role is passed, filter to announcements for that role + ALL
    if (role && typeof role === 'string' && role !== 'ADMIN') {
      const parsedRole = role.toUpperCase();
      if (Object.values(AnnouncementRole).includes(parsedRole as AnnouncementRole)) {
        whereClause.targetRole = {
          in: ['ALL', parsedRole]
        };
      }
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const { tenantId, title, content, targetRole, authorName } = req.body;
  const createdBy = ((req as any).user?.id || "");

  if (!tenantId || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!createdBy) {
    return res.status(401).json({ error: "User ID not found in headers" });
  }

  try {
    const validRole = Object.values(AnnouncementRole).includes(targetRole) ? targetRole : 'ALL';
    
    const announcement = await prisma.announcement.create({
      data: {
        tenantId,
        title,
        content,
        targetRole: validRole as AnnouncementRole,
        createdBy,
        authorName: authorName || "Admin"
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};


