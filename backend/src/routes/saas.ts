import { Router } from "express";
import { getPlatformStats, getTenants } from "../controllers/saas";
import { tenantIsolation } from "../middleware/tenantIsolation";

const saasRouter = Router();

// In a real application, you'd have a specific `saasSuperAdmin` check middleware, 
// but since tenantIsolation already checks saasSuperAdmin, we can use a custom middleware
// to strictly enforce SaaS access.

saasRouter.use(tenantIsolation);

saasRouter.use((req, res, next) => {
  const user = (req as any).user;
  if (!user?.saasSuperAdmin) {
    return res.status(403).json({ error: "Forbidden: SaaS Super Admin access required" });
  }
  next();
});

saasRouter.get("/stats", getPlatformStats);
saasRouter.get("/tenants", getTenants);

export default saasRouter;
