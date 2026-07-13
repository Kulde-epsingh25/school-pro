import express from "express";
import { getAssignments, createAssignment, getAssignmentById, getSubmissions, gradeSubmissions, getStudentAssignments, submitAssignment } from "../controllers/assignments";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getAssignments);
router.post("/", tenantIsolation, createAssignment);
router.get("/:id", tenantIsolation, getAssignmentById);

router.get("/:id/submissions", tenantIsolation, getSubmissions);
router.post("/:id/submissions/grade", tenantIsolation, gradeSubmissions);

// Student Routes
router.get("/student/me", tenantIsolation, getStudentAssignments);
router.post("/student/me/:assignmentId/submit", tenantIsolation, submitAssignment);

export default router;
