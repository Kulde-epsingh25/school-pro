import express from "express";
import { 
  getRoutes, 
  createRoute, 
  getVehicles, 
  createVehicle, 
  allocateStudent, 
  getMyRoute 
} from "../controllers/transport";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.get("/routes", getRoutes);
router.post("/routes", createRoute);
router.get("/vehicles", getVehicles);
router.post("/vehicles", createVehicle);
router.post("/allocate", allocateStudent);
router.get("/my-route", getMyRoute);

export default router;
