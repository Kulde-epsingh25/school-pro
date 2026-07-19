import express from "express";
import { 
  getHostels, 
  createHostel, 
  addRoom, 
  allocateStudent, 
  getMyRoom,
  getVisitors,
  issueVisitorPass,
  checkoutVisitor
} from "../controllers/hostel";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.get("/all", getHostels);
router.post("/create", createHostel);
router.post("/rooms", addRoom);
router.post("/allocate", allocateStudent);
router.get("/my-room", getMyRoom);
router.get("/visitors", getVisitors);
router.post("/visitors", issueVisitorPass);
router.post("/visitors/checkout", checkoutVisitor);

export default router;
