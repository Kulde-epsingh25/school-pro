import express from "express";
import { createUser, getUsers, getUser, updateUser, updateUserRoles, removeUserFromTenant } from "../controllers/users";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

router.get("/", tenantIsolation, requirePermission("VIEW", "USERS"), getUsers);
router.post("/", tenantIsolation, requirePermission("MANAGE", "USERS"), createUser);

router.get("/:id", tenantIsolation, requirePermission("VIEW", "USERS"), getUser);
router.put("/:id", tenantIsolation, requirePermission("MANAGE", "USERS"), updateUser);
router.put("/:id/roles", tenantIsolation, requirePermission("MANAGE", "USERS"), updateUserRoles);
router.delete("/:id", tenantIsolation, requirePermission("MANAGE", "USERS"), removeUserFromTenant);

export default router;
