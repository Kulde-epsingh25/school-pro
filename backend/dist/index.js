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
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use("/", school_1.default);
app.use("/academics", academics_1.default);
app.use("/finance", finance_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
