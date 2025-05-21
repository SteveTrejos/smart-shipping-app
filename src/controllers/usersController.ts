import type { Request, Response } from 'express';
import { UserModel } from '../models/usersModel'
export class UserController{
    static async getUserById(req: Request, res: Response): Promise<void>{
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                res.status(400).json({ message: 'Invalid user ID' });
                return;
            }

            const user = await UserModel.getUserById(userId);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }catch (err: any) {
            res.status(500).json({message: err.message || 'Server error'})
        }
    }    

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
            }

            const fieldsToUpdate = req.body;

            if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            res.status(400).json({ message: 'No fields provided for update' });
            return;
            }

            const isUserUpdated = await UserModel.updateUser({id: userId, ...fieldsToUpdate });

            if (!isUserUpdated) {
            res.status(400).json({ message: `Couldn't update the user` });
            return;
            }

            res.status(200).json({ message: 'User updated successfully' });
        }catch (err: any) {
            res.status(500).json({ message: err.message || 'Server error' });
        }
    }
}