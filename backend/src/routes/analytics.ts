import { Router } from "express";
import { getDashboardMetrics, getStudentPerformance, getAttendanceTrends, getFinancialSummary } from "../controllers/analytics";

const analyticsRouter = Router();

analyticsRouter.get("/", getDashboardMetrics);
analyticsRouter.get("/student-performance", getStudentPerformance);
analyticsRouter.get("/attendance-trends", getAttendanceTrends);
analyticsRouter.get("/financial-summary", getFinancialSummary);

export default analyticsRouter;
