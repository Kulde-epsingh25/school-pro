import express from "express";
import { getTerms, createTerm, getDepartments, createDepartment, getDepartment, updateDepartment, deleteDepartment, getSubjects, createSubject } from "../controllers/academics";

const router = express.Router();

router.get("/terms", getTerms);
router.post("/terms", createTerm);

router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.get("/departments/:id", getDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);

export default router;
