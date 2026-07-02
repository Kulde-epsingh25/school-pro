import express from "express";
import { getFees, createFee, getPayments, createPayment, getStudentPayments } from "../controllers/finance";

const router = express.Router();

router.get("/fees", getFees);
router.post("/fees", createFee);

router.get("/payments", getPayments);
router.post("/payments", createPayment);
router.get("/payments/student/:studentId", getStudentPayments);

export default router;
