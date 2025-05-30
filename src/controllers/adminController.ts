import type {Request, Response} from 'express';
import { AdminModel } from '../models/adminModel';
export class AdminController{
    static async createAdmin(req: Request, res: Response): Promise<void>{
        try {
            const params = req.body;
            const newAdmin = await AdminModel.createAdmin({...params});
            if(!newAdmin){
                res.status(400).json({message: `Not register found`});
                return;
            }
            res.status(200).json({message: `Admin created correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't create the admin.`, error: err.message});
        }
    }

    static async deleteAdmin(req: Request, res: Response): Promise<void>{
        try {
            const {adminId} = req.params;
            if(!Number(adminId)){
                res.status(500).json({message: `Invalid admin ID. ${adminId}`});
                return;
            }
            const isAdminDeleted = await AdminModel.deleteAdmin(Number(adminId));
            if(!isAdminDeleted){
                res.status(400).json({message: `Couldn't delete the admin ${Number(adminId)}`});
                return;
            }
            res.status(200).json({message: `Admin deleted correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't delete the admin`, error: err.message});
        }
    }

    static async updateAdmin(req: Request, res: Response): Promise<void>{
        try {
            const params = req.body;
            const {adminId} = req.params;
            const isAdminUpdated = await AdminModel.updateAdmin({...params, id: adminId});
            if(!isAdminUpdated){
                res.status(500).json({message: `Couldn't update the admin ${isAdminUpdated}`});
                return;
            }
            res.status(200).json({message: `Admin updated correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't update the admin`, error: err.message});
        }
    }
}