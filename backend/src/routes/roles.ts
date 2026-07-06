import express from "express";
import { getRoles, getPermissions, createRole, getRole, updateRole, deleteRole } from "../controllers/roles";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

// Get roles and permissions might be needed by various users for listing or UI
router.get("/", tenantIsolation, getRoles);
router.get("/permissions", tenantIsolation, getPermissions);

// Only admins with MANAGE_ROLES can create roles
// requirePermission depends on tenantIsolation setting req.user
router.post("/", tenantIsolation, requirePermission('MANAGE', 'ROLES'), createRole);

router.get("/:id", tenantIsolation, requirePermission('VIEW', 'ROLES'), getRole);
router.put("/:id", tenantIsolation, requirePermission('MANAGE', 'ROLES'), updateRole);
router.delete("/:id", tenantIsolation, requirePermission('MANAGE', 'ROLES'), deleteRole);

export default router;
