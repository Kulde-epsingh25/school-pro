"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentPayments = exports.createPayment = exports.getPayments = exports.createFee = exports.getFees = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling
const getFees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fees = yield prisma.fee.findMany({
            where: { tenantId: DUMMY_TENANT_ID },
            include: {
                class: true,
                term: true,
                items: true
            }
        });
        const formatted = fees.map(f => (Object.assign(Object.assign({}, f), { totalAmount: f.items.reduce((sum, item) => sum + item.amount, 0) })));
        res.json(formatted);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to fetch fees" });
    }
});
exports.getFees = getFees;
const createFee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId, termId, items } = req.body;
    try {
        const tenant = yield prisma.tenant.upsert({
            where: { id: DUMMY_TENANT_ID },
            update: {},
            create: { id: DUMMY_TENANT_ID, name: "Default College" }
        });
        const fee = yield prisma.fee.create({
            data: {
                tenantId: tenant.id,
                classId,
                termId,
                items: {
                    create: items.map((i) => ({
                        title: i.title,
                        amount: parseFloat(i.amount)
                    }))
                }
            }
        });
        res.json(fee);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to create fee" });
    }
});
exports.createFee = createFee;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield prisma.payment.findMany({
            include: {
                student: {
                    include: { class: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(payments);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to fetch payments" });
    }
});
exports.getPayments = getPayments;
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, amount, status, description } = req.body;
    try {
        const prn = "PRN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
        const payment = yield prisma.payment.create({
            data: {
                studentId,
                amount,
                status,
                description,
                prn
            }
        });
        res.json(payment);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to create payment" });
    }
});
exports.createPayment = createPayment;
const getStudentPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield prisma.payment.findMany({
            where: { studentId: req.params.studentId },
            orderBy: { createdAt: "desc" }
        });
        res.json(payments);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to fetch student payments" });
    }
});
exports.getStudentPayments = getStudentPayments;
