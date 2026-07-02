"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const academics_1 = require("../controllers/academics");
const router = express_1.default.Router();
router.get("/terms", academics_1.getTerms);
router.post("/terms", academics_1.createTerm);
router.get("/departments", academics_1.getDepartments);
router.post("/departments", academics_1.createDepartment);
router.get("/subjects", academics_1.getSubjects);
router.post("/subjects", academics_1.createSubject);
exports.default = router;
