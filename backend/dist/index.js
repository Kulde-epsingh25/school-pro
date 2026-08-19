"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const tenantIsolation_1 = require("./middleware/tenantIsolation");
const school_1 = __importDefault(require("./routes/school"));
const academics_1 = __importDefault(require("./routes/academics"));
const finance_1 = __importDefault(require("./routes/finance"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const roles_1 = __importDefault(require("./routes/roles"));
const tenant_1 = __importDefault(require("./routes/tenant"));
const platformUser_1 = __importDefault(require("./routes/platformUser"));
const system_1 = __importDefault(require("./routes/system"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const saas_1 = __importDefault(require("./routes/saas"));
const audit_1 = __importDefault(require("./routes/audit"));
const security_1 = __importDefault(require("./routes/security"));
const classes_1 = __importDefault(require("./routes/classes"));
const students_1 = __importDefault(require("./routes/students"));
const parents_1 = __importDefault(require("./routes/parents"));
const teachers_1 = __importDefault(require("./routes/teachers"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const exams_1 = __importDefault(require("./routes/exams"));
const grades_1 = __importDefault(require("./routes/grades"));
const assignments_1 = __importDefault(require("./routes/assignments"));
const announcements_1 = __importDefault(require("./routes/announcements"));
const reports_1 = __importDefault(require("./routes/reports"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const timetable_1 = __importDefault(require("./routes/timetable"));
const communication_1 = __importDefault(require("./routes/communication"));
const documents_1 = __importDefault(require("./routes/documents"));
const leaves_1 = __importDefault(require("./routes/leaves"));
const fees_1 = __importDefault(require("./routes/fees"));
const library_1 = __importDefault(require("./routes/library"));
const transport_1 = __importDefault(require("./routes/transport"));
const hostel_1 = __importDefault(require("./routes/hostel"));
const app = (0, express_1.default)();
const port = env_1.env.PORT;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ["https://school-pro-mocha-beta.vercel.app", env_1.env.FRONTEND_URL],
    credentials: true
}));
app.use(express_1.default.json({ limit: "10mb" }));
const limiter = (0, express_rate_limit_1.default)({
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
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 auth requests per window
    message: { error: "Too many authentication attempts, please try again later." }
});
app.use("/auth", authLimiter, auth_1.default);
// Apply tenant isolation middleware to all protected routes
app.use(tenantIsolation_1.tenantIsolation);
app.use("/users", users_1.default);
app.use("/roles", roles_1.default);
app.use("/tenants", tenant_1.default);
app.use("/platform-users", platformUser_1.default);
app.use("/system", system_1.default);
app.use("/analytics", analytics_1.default);
app.use("/saas", saas_1.default);
app.use("/audit", audit_1.default);
app.use("/security", security_1.default);
app.use("/", school_1.default);
app.use("/academics", academics_1.default);
app.use("/finance", finance_1.default);
app.use("/classes", classes_1.default);
app.use("/students", students_1.default);
app.use("/parents", parents_1.default);
app.use("/teachers", teachers_1.default);
app.use("/attendance", attendance_1.default);
app.use("/exams", exams_1.default);
app.use("/grades", grades_1.default);
app.use("/assignments", assignments_1.default);
app.use("/announcements", announcements_1.default);
app.use("/reports", reports_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/timetable", timetable_1.default);
app.use("/communication", communication_1.default);
app.use("/documents", documents_1.default);
app.use("/leaves", leaves_1.default);
app.use("/fees", fees_1.default);
app.use("/library", library_1.default);
app.use("/transport", transport_1.default);
app.use("/hostel", hostel_1.default);
const errorHandler_1 = require("./middleware/errorHandler");
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
