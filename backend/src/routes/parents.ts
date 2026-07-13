import express from "express";
import { getParents, createParent, getMyChildren } from "../controllers/parents";

const router = express.Router();

router.get("/me/children", getMyChildren);
router.get("/", getParents);
router.post("/", createParent);

export default router;
