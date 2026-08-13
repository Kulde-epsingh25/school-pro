"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const finance_1 = require("../controllers/finance");
const tenantIsolation_1 = require("../middleware/tenantIsolation");
const router = express_1.default.Router();
router.get("/fees", tenantIsolation_1.tenantIsolation, finance_1.getFees);
router.post("/fees", tenantIsolation_1.tenantIsolation, finance_1.createFee);
router.get("/payments", tenantIsolation_1.tenantIsolation, finance_1.getPayments);
router.post("/payments", tenantIsolation_1.tenantIsolation, finance_1.createPayment);
router.get("/payments/student/:studentId", tenantIsolation_1.tenantIsolation, finance_1.getStudentPayments);
router.get("/payroll", tenantIsolation_1.tenantIsolation, finance_1.getPayroll);
router.post("/payroll", tenantIsolation_1.tenantIsolation, finance_1.createSalaryPayment);
router.get("/expenses", tenantIsolation_1.tenantIsolation, finance_1.getExpenses);
router.post("/expenses", tenantIsolation_1.tenantIsolation, finance_1.createExpense);
exports.default = router;
