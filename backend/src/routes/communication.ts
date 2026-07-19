import express from "express";
import { 
  getConversations, 
  getConversationMessages, 
  sendMessage,
  getNotifications,
  markNotificationRead,
  getPreferences,
  updatePreferences
} from "../controllers/communication";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

// Apply tenant isolation middleware to all routes
router.use(tenantIsolation);

// Conversations & Messages
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.post("/messages", sendMessage);

// Notifications
router.get("/notifications", getNotifications);
router.put("/notifications/:notificationId/read", markNotificationRead);

// Preferences
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

export default router;
