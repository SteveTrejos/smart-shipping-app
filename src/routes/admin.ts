import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const adminRouter = Router();

adminRouter.get("/admin/users", AdminController.getAllUsers);
adminRouter.get("/admin/users/:userId", AdminController.getUserById);
adminRouter.patch("/admin/:userId", AdminController.updateUser);
adminRouter.patch("/admin/users/:userId/status", AdminController.deleteUser);
adminRouter.post("/admin", AdminController.createAdmin);
adminRouter.patch("/admin/:adminId/status", AdminController.deleteAdmin);
adminRouter.patch("/admin/:adminId", AdminController.updateAdmin);

export default adminRouter;