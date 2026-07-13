import express from "express";
import { getAttendance, markAttendance } from "../controllers/attendance";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getAttendance);
router.post("/", tenantIsolation, markAttendance);

export default router;
