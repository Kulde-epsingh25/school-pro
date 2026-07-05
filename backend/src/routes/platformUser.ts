import { Router } from "express";
import { getPlatformUsers } from "../controllers/platformUser";

const platformUserRouter = Router();

platformUserRouter.get("/", getPlatformUsers);

export default platformUserRouter;
