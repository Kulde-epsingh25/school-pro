"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const finance_1 = require("../controllers/finance");
const router = express_1.default.Router();
router.get("/fees", finance_1.getFees);
router.post("/fees", finance_1.createFee);
router.get("/payments", finance_1.getPayments);
router.post("/payments", finance_1.createPayment);
router.get("/payments/student/:studentId", finance_1.getStudentPayments);
exports.default = router;
