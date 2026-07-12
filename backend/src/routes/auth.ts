import express from "express";
import { setupPassword, login, onboardSchool } from "../controllers/auth";

const router = express.Router();

router.post("/onboard", onboardSchool);
router.post("/setup-password", setupPassword);
router.post("/login", login);

export default router;
