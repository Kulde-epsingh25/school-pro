import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/system";

const systemRouter = Router();

systemRouter.get("/", getSettings);
systemRouter.put("/", updateSettings);

export default systemRouter;
