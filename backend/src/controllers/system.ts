import { Request, Response } from "express";
import { prisma } from "../db";

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await prisma.systemSettings.findMany({
      orderBy: { key: "asc" }
    });
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch system settings" });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const { settings } = req.body; // Array of { key, value }

    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: "Settings must be an array" });
    }

    // Perform upserts for all settings
    const operations = settings.map(setting => 
      prisma.systemSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { 
          key: setting.key, 
          value: setting.value,
          description: setting.description || ""
        }
      })
    );

    await prisma.$transaction(operations);

    // Audit log
    await prisma.auditLog.create({
       data: {
         action: "UPDATE",
         resourceType: "SETTINGS",
         actorEmail: "superadmin@system.local",
         details: "Updated system settings",
         status: "SUCCESS"
       }
    });

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update system settings" });
  }
}
