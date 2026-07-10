"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
app.use("/auth", auth_1.default);
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
