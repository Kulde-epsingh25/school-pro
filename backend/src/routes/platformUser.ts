import { Router } from "express";
import { getPlatformUsers, suspendUser, forcePasswordReset, updateUserRoles } from "../controllers/platformUser";
import { tenantIsolation } from "../middleware/tenantIsolation";

const platformUserRouter = Router();

platformUserRouter.use(tenantIsolation);

// SaaS Admin guard
platformUserRouter.use((req, res, next) => {
  const user = (req as any).user;
  if (!user?.saasSuperAdmin) {
    return res.status(403).json({ error: "Forbidden: SaaS Super Admin access required" });
  }
  next();
});

platformUserRouter.get("/", getPlatformUsers);
platformUserRouter.put("/:id/suspend", suspendUser);
platformUserRouter.post("/:id/force-password-reset", forcePasswordReset);
platformUserRouter.put("/:id/roles", updateUserRoles);

export default platformUserRouter;
