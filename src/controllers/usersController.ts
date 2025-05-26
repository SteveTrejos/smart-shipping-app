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

    static async deleteUser(req: Request, res: Response): Promise<void>{
        try {
            const userId = Number(req.params.userId);
            if (!userId || isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
            }

            const isUserDeleted = await UserModel.deleteUser(userId);
            if(!isUserDeleted){
                res.status(400).json({message: `Couldn't delete the user`});
            }
            res.status(200).json({message: `User deleted correctly`});
        } catch (err: any) {
            res.status(500).json({ message: err.message || 'Server error' });
        }
    }

    static async getAllShipments(req: Request, res: Response): Promise<void>{
        const userId = Number(req.params.userId);
        try {
            if (!userId || isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
            }

            const shipments = await UserModel.getAllShipments(userId);
            res.status(200).json({shipments});

        } catch (err: any) {
            res.status(500).json({message: `Couldn't get all the shipments for user ${userId}`, error: err.message});
        }
    }

    static async createShipment(req: Request, res: Response){
        try {
            const params = req.body;
            if(Object.keys(params).length === 0){
                res.status(400).json({message: `Not parameters found in the request`});
            }
            const newShipment = await UserModel.createShipment(params);
            if(!newShipment){
                console.log(newShipment)
                res.status(400).json({message: `Couldn't create the shipment. Unable to find it`});
                return;
            }
            if(Object.keys(newShipment).length > 0) res.status(200).json({message: `Shipment created correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't create the shipment. ${err}`, error: err.message || err})
        }
    }
}