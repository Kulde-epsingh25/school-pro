import { Router } from "express";
import { getPlatformStats, getTenants, getTenantDetails, toggleTenantSuspension, getAuditLogs, getAccountDetails, updatePassword, shareAccount, revokeShare } from "../controllers/saas";
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
saasRouter.get("/tenants/:id", getTenantDetails);
saasRouter.put("/tenants/:id/suspend", toggleTenantSuspension);

saasRouter.get("/audit-logs", getAuditLogs);

saasRouter.get("/account", getAccountDetails);
saasRouter.put("/account/password", updatePassword);
saasRouter.post("/account/share", shareAccount);
saasRouter.delete("/account/share/:email", revokeShare);

export default saasRouter;
