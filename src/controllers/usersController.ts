import type { Request, Response } from 'express';
import { UserModel } from '../models/usersModel'
export class UserController{
    static async getUserById(req: Request, res: Response): Promise<void>{
        try {
            const userId = Number(req.params.userId);
            const users = await UserModel.getUserById(userId);
            res.status(200).json(users);
        }catch (err: any) {
            res.status(500).json({message: err.message || 'Server error'})
        }
    }    
}