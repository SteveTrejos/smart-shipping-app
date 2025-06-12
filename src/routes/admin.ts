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
adminRouter.post("/admin/couriers", AdminController.createCourier);
adminRouter.get("/admin/couriers", AdminController.getAllCouriers);
adminRouter.patch("/admin/couriers/:courierId", AdminController.updateCourier);
adminRouter.get("/admin/couriers/:courierId", AdminController.getCourierById);
adminRouter.patch("/admin/couriers/:courierId/status", AdminController.deleteCourier);
adminRouter.patch("/admin/couriers/:courierId/vehicle", AdminController.removeCourierVehicle);
adminRouter.patch("/admin/couriers/:courierId/vehicle/:vehicleId", AdminController.assignCourierVehicle);
adminRouter.patch("/admin/shipments/:shipmentId/vehicle/:vehicleId", AdminController.updateShipmentVehicle);
adminRouter.patch("/admin/users/:userId/reset-password", AdminController.resetUserPassword)
adminRouter.patch("/admin/:userId", AdminController.updateUser);
adminRouter.patch("/admin/users/:userId/status", AdminController.deleteUser);
adminRouter.post("/admin", AdminController.createAdmin);
adminRouter.patch("/admin/:adminId/status", AdminController.deleteAdmin);
adminRouter.patch("/admin/:adminId", AdminController.updateAdmin);

export default adminRouter;