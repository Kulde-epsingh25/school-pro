import { Router } from "express";
import { getDashboardMetrics } from "../controllers/analytics";

const analyticsRouter = Router();

analyticsRouter.get("/", getDashboardMetrics);

export default analyticsRouter;
