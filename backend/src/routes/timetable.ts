import express from "express";
import { createTimetablePeriod, getClassTimetable, getTeacherTimetable, getStudentTimetable } from "../controllers/timetable";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.post("/", createTimetablePeriod);
router.get("/", getClassTimetable);
router.get("/teacher/me", getTeacherTimetable);
router.get("/student/me", getStudentTimetable);

export default router;
