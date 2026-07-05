"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
});
app.use("/auth", auth_1.default);
app.use("/users", users_1.default);
app.use("/roles", roles_1.default);
app.use("/tenants", tenant_1.default);
app.use("/platform-users", platformUser_1.default);
app.use("/system", system_1.default);
app.use("/analytics", analytics_1.default);
app.use("/", school_1.default);
app.use("/academics", academics_1.default);
app.use("/finance", finance_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
