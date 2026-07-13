import express from "express";
import { getGrades, bulkSaveGrades, getStudentReportCard } from "../controllers/grades";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getGrades);
router.post("/", tenantIsolation, bulkSaveGrades);
router.get("/report-card/:studentId", tenantIsolation, getStudentReportCard);

export default router;
