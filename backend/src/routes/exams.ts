import express from "express";
import { getExams, createExam, getExamById } from "../controllers/exams";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getExams);
router.post("/", tenantIsolation, createExam);
router.get("/:id", tenantIsolation, getExamById);

export default router;
