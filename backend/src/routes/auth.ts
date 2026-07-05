import express from "express";
import { onboardSchool, setupPassword, login } from "../controllers/auth";

const router = express.Router();

router.post("/onboard", onboardSchool);
router.post("/setup-password", setupPassword);
router.post("/login", login);

export default router;
