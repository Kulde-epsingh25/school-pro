import express from "express";
import { setupPassword, login, onboardSchool } from "../controllers/auth";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, verifySchema } from "../schemas/auth.schema";
import { createTenantSchema } from "../schemas/tenant.schema";

const router = express.Router();

router.post("/onboard", validateRequest(createTenantSchema), onboardSchool);
router.post("/setup-password", validateRequest(verifySchema), setupPassword);
router.post("/login", validateRequest(loginSchema), login);

export default router;
