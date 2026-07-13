import express from "express";
import { getTenantDashboardMetrics } from "../controllers/dashboard";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/metrics", tenantIsolation, getTenantDashboardMetrics);

export default router;
