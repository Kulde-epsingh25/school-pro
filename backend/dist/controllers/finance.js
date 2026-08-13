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
exports.createExpense = exports.getExpenses = exports.createSalaryPayment = exports.getPayroll = exports.getStudentPayments = exports.createPayment = exports.getPayments = exports.createFee = exports.getFees = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getFees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, classId } = req.query;
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: "Tenant ID is required" });
    }
    try {
        const whereClause = { tenantId };
        if (classId && typeof classId === 'string') {
            whereClause.classId = classId;
        }
        const fees = yield prisma.fee.findMany({
            where: whereClause,
            include: {
                class: true,
                term: true,
                items: true
            },
            orderBy: { createdAt: 'desc' }
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
    const { tenantId, classId, termId, items } = req.body;
    const createdBy = req.headers["x-user-id"];
    if (!tenantId || !classId || !termId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!createdBy) {
        return res.status(401).json({ error: "User ID not found in headers" });
    }
    try {
        const fee = yield prisma.fee.create({
            data: {
                tenantId,
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
        res.status(201).json(fee);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to create fee" });
    }
});
exports.createFee = createFee;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: "Tenant ID is required" });
    }
    try {
        const payments = yield prisma.payment.findMany({
            where: { tenantId },
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
    const { tenantId, studentId, amount, status, description } = req.body;
    const recordedBy = req.headers["x-user-id"];
    if (!tenantId || !studentId || amount === undefined || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!recordedBy) {
        return res.status(401).json({ error: "User ID not found in headers" });
    }
    try {
        // Generate a unique PRN (Payment Reference Number)
        const prn = "PRN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
        const payment = yield prisma.payment.create({
            data: {
                tenantId,
                studentId,
                amount: parseFloat(amount),
                status,
                description,
                prn
            }
        });
        res.status(201).json(payment);
    }
    catch (error) {
        console.error('[API Error in finance.ts]', error);
        res.status(500).json({ error: "Failed to create payment" });
    }
});
exports.createPayment = createPayment;
const getStudentPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    const { studentId } = req.params;
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: "Tenant ID is required" });
    }
    try {
        const payments = yield prisma.payment.findMany({
            where: { tenantId, studentId },
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
const getPayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const payroll = yield prisma.salaryPayment.findMany({
            where: { tenantId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payroll);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch payroll" });
    }
});
exports.getPayroll = getPayroll;
const createSalaryPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, userId, amount, month, year, status } = req.body;
    if (!tenantId || !userId || amount === undefined || !month || !year || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const payment = yield prisma.salaryPayment.create({
            data: {
                tenantId,
                userId,
                amount: parseFloat(amount),
                month: parseInt(month),
                year: parseInt(year),
                status
            }
        });
        res.status(201).json(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create salary payment" });
    }
});
exports.createSalaryPayment = createSalaryPayment;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const expenses = yield prisma.expense.findMany({
            where: { tenantId },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});
exports.getExpenses = getExpenses;
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, title, amount, category, date } = req.body;
    if (!tenantId || !title || amount === undefined || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const expense = yield prisma.expense.create({
            data: {
                tenantId,
                title,
                amount: parseFloat(amount),
                category,
                date: date ? new Date(date) : new Date()
            }
        });
        res.status(201).json(expense);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create expense" });
    }
});
exports.createExpense = createExpense;
