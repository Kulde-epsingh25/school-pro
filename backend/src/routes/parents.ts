import express from "express";
import { getParents, createParent } from "../controllers/parents";

const router = express.Router();

router.get("/", getParents);
router.post("/", createParent);

export default router;
