import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const adminRouter = Router();

adminRouter.post("/admin", AdminController.createAdmin);
adminRouter.patch("/admin/:adminId/status", AdminController.deleteAdmin);
adminRouter.patch("/admin/:adminId", AdminController.updateAdmin);

export default adminRouter;