import express from "express";
import { getClasses, createClass, createStream } from "../controllers/classes";

const router = express.Router();

router.get("/", getClasses);
router.post("/", createClass);
router.post("/streams", createStream);

export default router;
