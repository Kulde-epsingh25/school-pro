import { Request, Response } from "express";
import { db } from "../db";

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await db.systemSettings.findMany({
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
    const operations = settings.map((setting: any) => 
      db.systemSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { 
          key: setting.key, 
          value: setting.value,
          description: setting.description || ""
        }
      })
    );

    await db.$transaction(operations);

    // Audit log (TODO: Implement SaaS global audit log)
    /*
    await db.auditLog.create({
       data: {
         action: "UPDATE",
         resourceType: "SETTINGS",
         actorEmail: "superadmin@system.local",
         details: "Updated system settings",
         status: "SUCCESS"
       }
    });
    */

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update system settings" });
  }
}

