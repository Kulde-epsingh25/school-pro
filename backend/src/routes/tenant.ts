import { Router } from "express";
import { getTenants, createTenant } from "../controllers/tenant";

const tenantRouter = Router();

tenantRouter.get("/", getTenants);
tenantRouter.post("/", createTenant);

export default tenantRouter;
