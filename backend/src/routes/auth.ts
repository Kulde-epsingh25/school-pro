import express from "express";
import { setupPassword, login } from "../controllers/auth";

const router = express.Router();

router.post("/setup-password", setupPassword);
router.post("/login", login);

export default router;
