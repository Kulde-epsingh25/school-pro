import express from "express";
import { getRoles, getPermissions, createRole } from "../controllers/roles";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

// Get roles and permissions might be needed by various users for listing or UI
router.get("/", tenantIsolation, getRoles);
router.get("/permissions", tenantIsolation, getPermissions);

// Only admins with MANAGE_ROLES can create roles
// requirePermission depends on tenantIsolation setting req.user
router.post("/", tenantIsolation, requirePermission('MANAGE', 'ROLES'), createRole);

export default router;
