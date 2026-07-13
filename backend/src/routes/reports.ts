import express from "express";
import { getFinancialReport, getAcademicReport } from "../controllers/reports";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

const router = express.Router();

router.get("/financial", tenantIsolation, cacheMiddleware, getFinancialReport);
router.get("/academic", tenantIsolation, cacheMiddleware, getAcademicReport);

export default router;
