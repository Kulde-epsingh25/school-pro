import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { tenantIsolation } from "./middleware/tenantIsolation";
import schoolRouter from "./routes/school";
import academicsRouter from "./routes/academics";
import financeRouter from "./routes/finance";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import rolesRouter from "./routes/roles";
import tenantRouter from "./routes/tenant";
import platformUserRouter from "./routes/platformUser";
import systemRouter from "./routes/system";
import analyticsRouter from "./routes/analytics";
import saasRouter from "./routes/saas";
import auditRouter from "./routes/audit";
import securityRouter from "./routes/security";
import classesRouter from "./routes/classes";
import studentsRouter from "./routes/students";
import parentsRouter from "./routes/parents";

const app = express();
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);

// Apply tenant isolation middleware to all protected routes
app.use(tenantIsolation);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/tenants", tenantRouter);
app.use("/platform-users", platformUserRouter);
app.use("/system", systemRouter);
app.use("/analytics", analyticsRouter);
app.use("/saas", saasRouter);
app.use("/audit", auditRouter);
app.use("/security", securityRouter);
app.use("/", schoolRouter);
app.use("/academics", academicsRouter);
app.use("/finance", financeRouter);
app.use("/classes", classesRouter);
app.use("/students", studentsRouter);
app.use("/parents", parentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
