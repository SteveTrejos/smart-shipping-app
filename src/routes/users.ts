import {Router} from 'express';
import { UserController } from '../controllers/usersController';
const router = Router();

router.get("/users/:userId", UserController.getUserById);
router.get("/users/:userId/shipments", UserController.getAllShipments);
router.patch("/users/:userId", UserController.updateUser);
router.patch("/users/:userId/status", UserController.deleteUser);
router.post("/users/:userId/shipments", UserController.createShipment);

export default router;