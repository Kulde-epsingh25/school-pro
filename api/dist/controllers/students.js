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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudents = exports.createStudent = exports.getParents = exports.createParent = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createParent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const parent = yield db_1.db.parent.create({ data });
        res.status(201).json(parent);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create parent" });
    }
});
exports.createParent = createParent;
const getParents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parents = yield db_1.db.parent.findMany();
        res.status(200).json(parents);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch parents" });
    }
});
exports.getParents = getParents;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
        const student = yield db_1.db.student.create({
            data: Object.assign(Object.assign({}, data), { password: hashedPassword })
        });
        res.status(201).json(student);
    }
    catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Failed to create student" });
    }
});
exports.createStudent = createStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield db_1.db.student.findMany({
            include: {
                parent: true,
                class: true,
                stream: true
            }
        });
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});
exports.getStudents = getStudents;
