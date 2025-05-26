import { Router } from "express";
import { AuthController } from "../controllers/authController";

const authRouter = Router();
authRouter.post("/auth/forgot-password", AuthController.sendPasswordRecoveryEmail);

export default authRouter;