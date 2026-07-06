import express from "express";
import cors from "cors";
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

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRouter);
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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
