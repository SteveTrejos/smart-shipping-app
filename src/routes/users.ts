import {Router} from 'express';
import { UserController } from '../controllers/usersController';
const userRouter = Router();
userRouter.get("/users/:userId", UserController.getUserById);
userRouter.get("/users/:userId/shipments", UserController.getAllShipments);
userRouter.get("/users/shipments/:trackId", UserController.getShipmentByTrackId);
userRouter.patch("/users/:userId", UserController.updateUser);
userRouter.patch("/users/:userId/status", UserController.deleteUser);
userRouter.patch("/users/:userId/shipments/:shipmentId/status",UserController.cancelShipment);
userRouter.post("/users/:userId/shipments", UserController.createShipment);

export default userRouter;