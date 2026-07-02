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
exports.getSchools = exports.createSchool = void 0;
const db_1 = require("../db");
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, logo } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const school = yield db_1.db.school.create({
            data: {
                name,
                logo,
            },
        });
        res.status(201).json(school);
    }
    catch (error) {
        console.error("Error creating school:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createSchool = createSchool;
const getSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield db_1.db.school.findMany();
        res.status(200).json(schools);
    }
    catch (error) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSchools = getSchools;
