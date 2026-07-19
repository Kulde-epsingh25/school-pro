import express from "express";
import { 
  getMyFees, 
  getOutstandingFees, 
  recordPayment, 
  applyScholarship 
} from "../controllers/fees";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.get("/my-fees", getMyFees);
router.get("/outstanding", getOutstandingFees);
router.post("/payment", recordPayment);
router.put("/:id/apply-scholarship", applyScholarship);

export default router;
