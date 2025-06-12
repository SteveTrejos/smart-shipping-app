import type {Request, Response} from 'express';
import { AdminModel } from '../models/adminModel';
import { UserModel } from '../models/usersModel';
import { VehicleModel } from '../models/vehicleModel';
import { CourierModel } from '../models/couriersModel';
import type { Courier } from '../interfaces/courierInterface';
import { ShipmentModel } from '../models/shipmentsModel';
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

    static async getAllUsers(req: Request, res: Response): Promise<void>{
        try {
            const {limit, offset} = req.body;
            if(limit === undefined || offset === undefined){
                res.status(400).json({message: `Limit or Offset not found`, params: {limit, offset}});
                return;
            }
            const users = await UserModel.getAllUsers(limit, offset);
            if(!users){
                res.status(404).json({message: `Users not found`});
                return;
            }
            res.status(200).json(users);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't get all the users from admin.`, error : err.message})
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void>{
        try {
            const {userId} = req.params;
            if(!userId){
                res.status(404).json({message: `User ID not found`})
            }
            const user = await UserModel.getUserById(Number(userId));
            if(!user){
                res.status(404).json({message: `User not found`});
                return;
            }
            res.status(200).json({user});         

        } catch (err: any) {
            res.status(500).json({message: `Couldn't get the user by id`, error: err.message})
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void>{
        try {
            const {userId: id} = req.params;
            const isUserUpdated = await UserModel.updateUser({id, ...req.body});
            if(!isUserUpdated){
                res.status(500).json({message: `Couldn't update the user`, isUserUpdated});
                return;
            }
            res.status(200).json({message: `User updated correctly`});

        } catch (err: any) {
            res.status(500).json({message: `Couldn't update the user`, error: err.message})
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void>{
        try {
            const {userId} = req.params;
            if(!userId){
                res.status(500).json({message: `Invalid User ID`});
                return;
            }
            const isUserDeleted = await UserModel.deleteUser(Number(userId));
            if(!isUserDeleted){
                res.status(400).json({message: `Couldn't delete the user`, isUserDeleted});
                return;
            }
            res.status(200).json({message: `User deleted correctly`});

        } catch (err: any) {
            res.status(500).json({message: `Couldn't delete the user`, error: err.message});
        }
    }

    static async getAllUserShipments(req: Request, res: Response): Promise<void>{
        try {
            const {userId } = req.params;
            if(!userId){
                res.status(400).json({message: `Missing user ID`});
                return;
            }
            const userShipments = await UserModel.getAllShipmentsByUserId(Number(userId));
            if(!userShipments){
                res.status(500).json({message: `There was a problem getting the shipments`, data: userShipments});
                return;
            }
            res.status(200).json(userShipments);

        } catch (err: any) {
            res.status(500).json({message: `Couldn't get all the shipments`, error: err.message})
        }
    }
    
    static async getShipmentByTrackId(req: Request, res: Response): Promise<void>{
        try {
            const {trackId} = req.params;
            if(!trackId){
                res.status(400).json({message: `Missing track ID`});
                return;
            }
            const shipment = await UserModel.getShipmentByTrackId(trackId);
            if(!shipment){
                res.status(500).json({message: `Couldn't find the shipment`});
                return;
            }
            res.status(200).json(shipment);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't get the shipment`, error: err.message});
        }
    }

    static async createVehicle(req: Request, res: Response): Promise<void>{
        try {
            const params = req.body;
            if(!params || Object.keys(params).length === 0){
                res.status(400).json({message: `No body params send`});
                return;
            }
            const newVehicle = await VehicleModel.createVehicle({...params});
            if(!newVehicle || Object.keys(newVehicle).length === 0){
                res.status(500).json({message: `Couldn't create the vechicle`});
                return;
            }
            res.status(200).json({message: `Vehicle created correctly`});

        } catch (err: any) {
            res.status(500).json({messge: `Couldn't create the vechicle`, error: err.message});
        }
    }
    
    //TODO create the trigger that updates the field "modified by" when vehicle is updated
    static async updateVehicle(req: Request, res: Response): Promise<void>{
        try {
            const params = req.body;
             if(!params || Object.keys(params).length === 0){
                res.status(400).json({message: `No body params send`});
                return;
            }
            const updatedVehicle = await VehicleModel.updateVehicle({...params});
             if(!updatedVehicle || Object.keys(updatedVehicle).length === 0){
                res.status(500).json({message: `Couldn't update the vehicle`});
                return;
            }
            res.status(200).json({message: `Vehicle updated correctly`});


        } catch (err: any) {
            res.status(500).json({message: `Couldn't update the vehicle`, error: err.message});
        }
    }

    static async getAllVehicles(req: Request, res: Response): Promise<void>{
        try {
            const vehicles = await VehicleModel.getAllVehicles();
            if(!vehicles){
                res.status(500).json({message: `Couldn't find any vehicle`});
                return;
            }
            res.status(200).json(vehicles);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't get all the vehicles`, error: err.message});
        }
    }

    static async getVehicleById(req: Request, res: Response): Promise<void>{
        try {
            const {vehicleId} = req.params;
            if(!vehicleId){
                res.status(400).json({message: `Invalid vehicle ID`});
                return;
            }
            const vehicle = await VehicleModel.getVehicleById(Number(vehicleId));
            if(!vehicle){
                res.status(500).json({message: `Couldn't find the vehicle`});
                return;
            }
            res.status(200).json(vehicle);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't the vehicle by ID`, error: err.message});
        }
    }

    static async deleteVehicle(req: Request, res: Response): Promise<void>{
        try {
            const {vehicleId} = req.params;
            if(!vehicleId){
                res.status(400).json({message: `Invalid vehicle ID`});
                return;
            }
            const deletedVehicle = await VehicleModel.deleteVehicle(Number(vehicleId));
            if(!deletedVehicle){
                res.status(500).json({message: `Theres was an error deleting the vehicle`});
                return;
            }
            res.status(200).json({message: `Vehicle deleted correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't delete the vehicle`, error: err.message});
        }
    }

    static async createCourier(req: Request, res: Response): Promise<void>{
        try {
            const params = req.body;
            if(!params || Object.keys(params).length === 0){
                res.status(400).json({message: `No params for courier found`});
                return;
            }
            const newCourier: Courier | null = await CourierModel.createCourier(params);
            if(!newCourier){
                res.status(400).json({message: `There was an error creating the courier`});
                return;
            }
            res.status(200).json(`Courier created correctly`);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't create the courier`, error: err.message});
        }
    }

    static async getAllCouriers(req: Request, res: Response): Promise<void>{
        try {
            const couriers = await CourierModel.getAllCouriers();
            if(!couriers){
                res.status(400).json({message: `There was an error getting the couriers`});
            }
            res.status(200).json(couriers);

        } catch (err: any) {
            res.status(500).json({message: `Couldn't get all the couriers`, error: err.message});
        }
    }

    static async updateCourier(req: Request, res: Response): Promise<void>{
        try {
            const id = req.params.courierId;
            if(!id){
                res.status(400).json({message: `Invalid courier ID`});
                return;
            }
            const isCourierUpdated = await CourierModel.updateCourier({id, ...req.body});
            if(!isCourierUpdated){
                res.status(500).json({message: `There was an error updating the courier`});
                return
            }
            res.status(200).json({message: `Courier updated correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't update the courier`, error: err.message});
        }
    }

    static async getCourierById(req: Request, res: Response): Promise<void>{
        try {
            const courierId = req.params.courierId;
            if(!courierId){
                res.status(400).json({message: `Invalid courier ID`});
                return;
            }
            const courier = await CourierModel.getCourierById(Number(courierId));

            if(!courier){
                res.status(404).json({message: `Courier not found`});
                return;
            }
            res.status(200).json(courier);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't get the courier by id`, error: err.message});
        }
    }

    static async deleteCourier(req: Request, res: Response): Promise<void>{
        try {
            const courierId = req.params.courierId;
            if(!courierId){
                res.status(400).json({message: `Invalid courier ID`});
                return;
            }
            const isCourierDeleted = await CourierModel.deleteCourier(Number(courierId));
            if(!isCourierDeleted){
                res.status(500).json({message: `There was an error deleting the courier`});
                return;
            }
            res.status(200).json({message: `Courier deleted correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't delete the courier`, error: err.message});
        }
    }

    static async resetUserPassword(req: Request, res: Response): Promise<void>{
        try {
            const userUpdated = await UserModel.resetPasswordFromAdmin({...req.body});
            if(!userUpdated || Object.keys(userUpdated).length === 0){
                res.status(500).json({message: `There was an error reseting the password`});
                return;
            }
            res.status(200).json({message: `Password updated correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't reset the user's password`, error: err.message});
        }
    }

    static async assignCourierVehicle(req: Request, res: Response): Promise<void>{
        try {
            const {vehicleId, courierId} = req.params;
            if(!vehicleId || !courierId){
                res.status(400).json({message: `Invalid body params`});
                return;
            }
            const updatedCourier = await CourierModel.assignCourierToVehicle(Number(courierId), Number(vehicleId));
            if(!updatedCourier || Object.keys(updatedCourier).length === 0){
                res.status(500).json({message: `Couldn't find the updated courier`});
                return;
            }
            res.status(200).json(`Courier vehicle assigned correctly`);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't assign the vechicle to courier`, error: err.message});
        }
    }

    static async removeCourierVehicle(req: Request, res: Response): Promise<void>{
        try {
            const courierId = req.params.courierId;
            if(!courierId){
                res.status(400).json({message: `Invalid courier ID`});
                return;
            }
            const updatedCourier = await CourierModel.removeCourierVehicle(Number(courierId));
            if(!updatedCourier || Object.keys(updatedCourier).length === 0){
                res.status(500).json({message: `There was an error removing the courier's vehicle`});
                return;
            }
            res.status(200).json({message: `Vehicle removed correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't remove the courier's vehicle`, error: err.message});
        }
    }

    static async updateShipmentVehicle(req: Request, res: Response): Promise<void>{
        try {
            const {shipmentId, vehicleId} = req.params;
            if(!shipmentId || !vehicleId){
                res.status(400).json({message: `Invalid shipment or vehicle ID`});
                return;
            }
            const updatedShipment = await ShipmentModel.updateShipmentVehicle(Number(shipmentId), Number(vehicleId));
            if(!updatedShipment || Object.keys(updatedShipment).length === 0){
                res.status(500).json({message: `There was an error updating the shipment vehicle`});
                return;
            }
            res.status(200).json({message: `Shipment vehicle updated correctly`});
        } catch (err: any) {
            res.status(500).json({message: `Couldn't update the shipment vehicle`, erro: err.message});
        }
    }
}