import express from "express";
import { getFinancialReport, getAcademicReport, getAttendanceReport } from "../controllers/reports";
import { tenantIsolation } from "../middleware/tenantIsolation";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

const router = express.Router();

router.get("/financial", tenantIsolation, cacheMiddleware, getFinancialReport);
router.get("/academic", tenantIsolation, cacheMiddleware, getAcademicReport);
router.get("/attendance", tenantIsolation, cacheMiddleware, getAttendanceReport);

export default router;
