import express from "express";
import { getFees, createFee, getPayments, createPayment, getStudentPayments, getPayroll, createSalaryPayment, getExpenses, createExpense } from "../controllers/finance";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.get("/fees", tenantIsolation, getFees);
router.post("/fees", tenantIsolation, createFee);

router.get("/payments", tenantIsolation, getPayments);
router.post("/payments", tenantIsolation, createPayment);
router.get("/payments/student/:studentId", tenantIsolation, getStudentPayments);

router.get("/payroll", tenantIsolation, getPayroll);
router.post("/payroll", tenantIsolation, createSalaryPayment);

router.get("/expenses", tenantIsolation, getExpenses);
router.post("/expenses", tenantIsolation, createExpense);

export default router;
