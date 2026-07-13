import express from "express";
import { getTeachers, createTeacher } from "../controllers/teachers";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

router.get("/", tenantIsolation, requirePermission("VIEW", "USERS"), getTeachers);
router.post("/", tenantIsolation, requirePermission("MANAGE", "USERS"), createTeacher);

export default router;
