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
exports.createSubject = exports.getSubjects = exports.deleteDepartment = exports.updateDepartment = exports.getDepartment = exports.createDepartment = exports.getDepartments = exports.createTerm = exports.getTerms = void 0;
const db_1 = require("../db");
const DUMMY_TENANT_ID = "00000000-0000-0000-0000-000000000000"; // For compiling
const getTerms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const terms = yield db_1.db.term.findMany({
            where: { tenantId },
            orderBy: { year: "desc" }
        });
        res.json(terms);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed to fetch terms" });
    }
});
exports.getTerms = getTerms;
const createTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, year, startDate, endDate, isActive, tenantId } = req.body;
    if (!tenantId)
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        if (isActive) {
            yield db_1.db.term.updateMany({
                where: { tenantId },
                data: { isActive: false }
            });
        }
        const term = yield db_1.db.term.create({
            data: {
                name,
                year: parseInt(year),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
                tenantId
            }
        });
        res.json(term);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed to create term" });
    }
});
exports.createTerm = createTerm;
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const depts = yield db_1.db.department.findMany({
            where: { tenantId },
            include: { subjects: true }
        });
        res.json(depts);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.getDepartments = getDepartments;
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, tenantId } = req.body;
    if (!tenantId)
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const dept = yield db_1.db.department.create({
            data: { name, tenantId }
        });
        res.json(dept);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.createDepartment = createDepartment;
const getDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    const { id } = req.params;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const dept = yield db_1.db.department.findFirst({
            where: { id, tenantId },
            include: { subjects: true }
        });
        if (!dept)
            return res.status(404).json({ error: "Department not found" });
        res.json(dept);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.getDepartment = getDepartment;
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    const { id } = req.params;
    const { name } = req.body;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const dept = yield db_1.db.department.updateMany({
            where: { id, tenantId },
            data: { name }
        });
        if (dept.count === 0)
            return res.status(404).json({ error: "Department not found" });
        res.json({ message: "Department updated successfully" });
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    const { id } = req.params;
    if (!tenantId || typeof tenantId !== 'string')
        return res.status(400).json({ error: "Tenant ID required" });
    try {
        const dept = yield db_1.db.department.deleteMany({
            where: { id, tenantId }
        });
        if (dept.count === 0)
            return res.status(404).json({ error: "Department not found" });
        res.json({ message: "Department deleted successfully" });
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.deleteDepartment = deleteDepartment;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield db_1.db.subject.findMany({
            include: { department: true }
        });
        res.json(subjects);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.getSubjects = getSubjects;
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subject = yield db_1.db.subject.create({
            data: {
                name: req.body.name,
                code: req.body.code,
                departmentId: req.body.departmentId
            }
        });
        res.json(subject);
    }
    catch (error) {
        console.error('[API Error in academics.ts]', error);
        res.status(500).json({ error: "Failed" });
    }
});
exports.createSubject = createSubject;
