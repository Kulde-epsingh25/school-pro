import express from "express";
import cors from "cors";
import schoolRouter from "./routes/school";
import academicsRouter from "./routes/academics";
import financeRouter from "./routes/finance";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";

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
app.use("/", schoolRouter);
app.use("/academics", academicsRouter);
app.use("/finance", financeRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
