import express from "express";
import { 
  getLeaveBalance, 
  applyLeave, 
  approveLeave, 
  getLeaveApplications 
} from "../controllers/leaves";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.get("/balance", getLeaveBalance);
router.post("/apply", applyLeave);
router.put("/:id/approve", approveLeave);
router.get("/applications", getLeaveApplications);

export default router;
