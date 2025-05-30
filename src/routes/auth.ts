import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { injectUserId } from "../middlewares/auth";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();
authRouter.post("/auth/verify-code", [authMiddleware, injectUserId], AuthController.validateRecoveryCode);
authRouter.post("/auth/forgot-password", AuthController.sendPasswordRecoveryEmail);
authRouter.post("/auth/login", AuthController.login);
authRouter.post("/auth/users", AuthController.createUser);
authRouter.patch("/auth/reset-password", [authMiddleware, injectUserId], AuthController.updatePassword);

export default authRouter;