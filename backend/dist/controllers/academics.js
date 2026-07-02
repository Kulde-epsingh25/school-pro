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
exports.createSubject = exports.getSubjects = exports.createDepartment = exports.getDepartments = exports.createTerm = exports.getTerms = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling
const getTerms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const terms = yield prisma.term.findMany({
            where: { tenantId: DUMMY_TENANT_ID },
            orderBy: { year: "desc" }
        });
        res.json(terms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch terms" });
    }
});
exports.getTerms = getTerms;
const createTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, year, startDate, endDate, isActive } = req.body;
    try {
        // Basic tenant provision for dummy
        const tenant = yield prisma.tenant.upsert({
            where: { id: DUMMY_TENANT_ID },
            update: {},
            create: { id: DUMMY_TENANT_ID, name: "Default College" }
        });
        if (isActive) {
            yield prisma.term.updateMany({
                where: { tenantId: DUMMY_TENANT_ID },
                data: { isActive: false }
            });
        }
        const term = yield prisma.term.create({
            data: {
                name,
                year: parseInt(year),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
                tenantId: tenant.id
            }
        });
        res.json(term);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create term" });
    }
});
exports.createTerm = createTerm;
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const depts = yield prisma.department.findMany({
            where: { tenantId: DUMMY_TENANT_ID },
            include: { subjects: true }
        });
        res.json(depts);
    }
    catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});
exports.getDepartments = getDepartments;
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dept = yield prisma.department.create({
            data: { name: req.body.name, tenantId: DUMMY_TENANT_ID }
        });
        res.json(dept);
    }
    catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});
exports.createDepartment = createDepartment;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield prisma.subject.findMany({
            include: { department: true }
        });
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});
exports.getSubjects = getSubjects;
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subject = yield prisma.subject.create({
            data: {
                name: req.body.name,
                code: req.body.code,
                departmentId: req.body.departmentId
            }
        });
        res.json(subject);
    }
    catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});
exports.createSubject = createSubject;
