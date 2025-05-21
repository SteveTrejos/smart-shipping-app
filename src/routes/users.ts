import {Router} from 'express';
import { UserController } from '../controllers/usersController';
const router = Router();

router.get("/users/:userId", UserController.getUserById);
router.patch("/users/:userId", UserController.updateUser);

export default router;