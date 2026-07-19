import express from "express";
import { getAttendance, markAttendance, importBiometric } from "../controllers/attendance";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getAttendance);
router.post("/", tenantIsolation, markAttendance);
router.post("/import-biometric", tenantIsolation, importBiometric);

export default router;
