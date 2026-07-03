import express from "express";
import { getRoles } from "../controllers/roles";

const router = express.Router();

router.get("/", getRoles);

export default router;
