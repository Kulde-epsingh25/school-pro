import express from "express";
import { onboardSchool, setupPassword } from "../controllers/auth";

const router = express.Router();

router.post("/onboard", onboardSchool);
router.post("/setup-password", setupPassword);

export default router;
