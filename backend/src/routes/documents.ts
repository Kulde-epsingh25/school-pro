import express from "express";
import { 
  getTemplates, 
  createTemplate, 
  updateTemplate, 
  generateDocument, 
  batchGenerateDocuments 
} from "../controllers/documents";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

// Apply tenant isolation middleware to all routes
router.use(tenantIsolation);

// Templates
router.get("/templates", getTemplates);
router.post("/templates", createTemplate);
router.put("/templates/:id", updateTemplate);

// Generation
router.post("/generate", generateDocument);
router.post("/batch-generate", batchGenerateDocuments);

export default router;
