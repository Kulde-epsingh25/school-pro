import express from "express";
import { getTenantAuditLogs, getSaaSAuditLogs } from "../controllers/audit";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { requirePermission } from "../middleware/rbac";

const router = express.Router();

// SaaS route for global audit logs (must be super admin)
router.get("/saas", tenantIsolation, requirePermission("VIEW", "AUDIT"), getSaaSAuditLogs);

// Tenant specific route
router.get("/", tenantIsolation, requirePermission("VIEW", "AUDIT"), getTenantAuditLogs);

export default router;
