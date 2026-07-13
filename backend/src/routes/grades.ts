import express from "express";
import { getGrades, bulkSaveGrades } from "../controllers/grades";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getGrades);
router.post("/", tenantIsolation, bulkSaveGrades);

export default router;
