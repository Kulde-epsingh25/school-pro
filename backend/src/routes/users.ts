import express from "express";
import { createUser, getUsers } from "../controllers/users";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

router.get("/", tenantIsolation, requirePermission("VIEW", "USERS"), getUsers);
router.post("/", tenantIsolation, requirePermission("MANAGE", "USERS"), createUser);

export default router;
