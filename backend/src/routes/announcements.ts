import express from "express";
import { getAnnouncements, createAnnouncement } from "../controllers/announcements";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/", tenantIsolation, getAnnouncements);
router.post("/", tenantIsolation, createAnnouncement);

export default router;
