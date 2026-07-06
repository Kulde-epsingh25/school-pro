import express from "express";
import { getSharedAccess, updateSharedAccess } from "../controllers/security";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

// Only those who can manage settings should manage security
router.get("/shared-access", tenantIsolation, requirePermission("VIEW", "SETTINGS"), getSharedAccess);
router.put("/shared-access", tenantIsolation, requirePermission("MANAGE", "SETTINGS"), updateSharedAccess);

export default router;
