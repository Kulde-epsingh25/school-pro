import express from "express";
import { getAssignments, createAssignment, getAssignmentById, getSubmissions, gradeSubmissions } from "../controllers/assignments";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getAssignments);
router.post("/", tenantIsolation, createAssignment);
router.get("/:id", tenantIsolation, getAssignmentById);

router.get("/:id/submissions", tenantIsolation, getSubmissions);
router.post("/:id/submissions/grade", tenantIsolation, gradeSubmissions);

export default router;
