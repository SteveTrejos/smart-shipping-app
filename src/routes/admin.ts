import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const adminRouter = Router();

adminRouter.get("/admin/users", AdminController.getAllUsers);
adminRouter.get("/admin/users/:userId", AdminController.getUserById);
adminRouter.get("/admin/users/:userId/shipments", AdminController.getAllUserShipments);
adminRouter.get("/admin/shipments/:trackId", AdminController.getShipmentByTrackId);
adminRouter.post("/admin/vehicles", AdminController.createVehicle);
adminRouter.patch("/admin/vehicles/:vehicleId", AdminController.updateVehicle);
adminRouter.get("/admin/vehicles", AdminController.getAllVehicles);
adminRouter.get("/admin/vehicles/:vehicleId", AdminController.getVehicleById);
adminRouter.patch("/admin/vehicles/:vehicleId/status", AdminController.deleteVehicle);
adminRouter.patch("/admin/:userId", AdminController.updateUser);
adminRouter.patch("/admin/users/:userId/status", AdminController.deleteUser);
adminRouter.post("/admin", AdminController.createAdmin);
adminRouter.patch("/admin/:adminId/status", AdminController.deleteAdmin);
adminRouter.patch("/admin/:adminId", AdminController.updateAdmin);

export default adminRouter;