import { Router } from "express";
import { getTenants, createTenant } from "../controllers/tenant";
import { validateRequest } from "../middleware/validateRequest";
import { createTenantSchema } from "../schemas/tenant.schema";

const tenantRouter = Router();

tenantRouter.get("/", getTenants);
tenantRouter.post("/", validateRequest(createTenantSchema), createTenant);

export default tenantRouter;
