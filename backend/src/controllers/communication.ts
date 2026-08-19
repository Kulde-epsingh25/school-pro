import { Request, Response } from "express";
import { db as prisma } from "../db";
import { NotificationType } from "@prisma/client";

// -----------------------------------------
// MESSAGING & CONVERSATIONS
// -----------------------------------------

export const getConversations = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  // Use a default senderId for compilation if user isn't populated on req yet by middleware
  // In a real app we would use req.user.id
  const userId = (req as any).user?.id || req.query.userId; 

  if (!tenantId || typeof tenantId !== "string") {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        tenantId,
        participants: { has: userId }
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get latest message
          include: { sender: { select: { firstName: true, lastName: true } } }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("[API Error in getConversations]", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { conversationId } = req.params;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });

  try {
    const messages = await prisma.message.findMany({
      where: { tenantId, conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, firstName: true, lastName: true } } }
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("[API Error in getConversationMessages]", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { conversationId, content, recipientIds } = req.body;
  const senderId = (req as any).user?.id || req.body.senderId;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });
  if (!senderId) return res.status(400).json({ error: "Sender ID required" });
  if (!content) return res.status(400).json({ error: "Content required" });

  try {
    let convId = conversationId;

    // Create a new conversation if it doesn't exist
    if (!convId && recipientIds && Array.isArray(recipientIds)) {
      const participants = Array.from(new Set([senderId, ...recipientIds]));
      const conv = await prisma.conversation.create({
        data: {
          tenantId,
          participants
        }
      });
      convId = conv.id;
    }

    if (!convId) {
      return res.status(400).json({ error: "conversationId or recipientIds required" });
    }

    const message = await prisma.message.create({
      data: {
        tenantId,
        conversationId: convId,
        senderId,
        content,
        readBy: [senderId]
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("[API Error in sendMessage]", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// -----------------------------------------
// NOTIFICATIONS
// -----------------------------------------

export const getNotifications = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = (req as any).user?.id || req.query.userId;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "User ID required" });

  try {
    const notifications = await prisma.notification.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: "desc" },
      take: 50 // limit to recent 50
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("[API Error in getNotifications]", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { notificationId } = req.params;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, tenantId },
      data: { isRead: true }
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("[API Error in markNotificationRead]", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// -----------------------------------------
// PREFERENCES
// -----------------------------------------

export const getPreferences = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = (req as any).user?.id || req.query.userId;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "User ID required" });

  try {
    let pref = await prisma.notificationPreference.findUnique({
      where: { tenantId_userId: { tenantId, userId } }
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: { tenantId, userId }
      });
    }

    res.status(200).json(pref);
  } catch (error) {
    console.error("[API Error in getPreferences]", error);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const userId = (req as any).user?.id || req.body.userId;
  const { emailEnabled, pushEnabled, smsEnabled } = req.body;

  if (!tenantId || typeof tenantId !== "string") return res.status(400).json({ error: "Tenant ID required" });
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "User ID required" });

  try {
    const pref = await prisma.notificationPreference.upsert({
      where: { tenantId_userId: { tenantId, userId } },
      update: { emailEnabled, pushEnabled, smsEnabled },
      create: { tenantId, userId, emailEnabled, pushEnabled, smsEnabled }
    });

    res.status(200).json(pref);
  } catch (error) {
    console.error("[API Error in updatePreferences]", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
};


