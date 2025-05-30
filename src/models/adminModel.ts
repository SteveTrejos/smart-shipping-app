import { sql } from "bun";
import type { CreateAdminDTO } from "../dto/admin/createAdmin.dto";
import type { Admin } from "../interfaces/adminInterface";
import type { UpdateAdminDTO } from "../dto/admin/updateAdmin.dto";
import { UserModel } from "./usersModel";
import type { User } from "../interfaces/userInterface";
import type { UpdateUserDTO } from "../dto/users/updateUser.dto";
import type { Shipment } from "../interfaces/shipmentInterface";
import type { CreateVehicleDTO } from "../dto/vehicles/createVehicle.dto";
import { VehicleModel } from "./vehicleModel";
import type { Vehicle } from "../interfaces/vehicleInterface";
import type { UpdateVehicleDTO } from "../dto/vehicles/updateVehicle.dto";
import type { CreateCourierDTO } from "../dto/couriers/createCourier.dto";
import { CourierModel } from "./couriersModel";
import type { Courier } from "../interfaces/courierInterface";
import type { UpdateCourierDTO } from "../dto/couriers/updateCourier.dto";
import type { UserDetailsValidationDTO } from "../dto/users/userDetailsValidation.dto";
import type { UserDetailsPasswordUpdateDTO } from "../dto/users/userDetailsPasswordUpdate.dto";
import { ShipmentModel } from "./shipmentsModel";

export class AdminModel{
    static async createAdmin(adminDetails: CreateAdminDTO): Promise<Admin | null>{
        if(!adminDetails || Object.keys(adminDetails).length === 0) throw new Error('Invalid parameters in function "createAdmin"');
        try {
            const {password, ...fieldsToCreate} = adminDetails;
            if(!password) throw new Error('Password missing');
            const passwordHash = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 10
            });
            const newParams = {
                ...fieldsToCreate,
                password: passwordHash
            }
            const [newAdmin] = await sql`INSERT INTO admin ${sql(newParams)} RETURNING *`;
            if(!newAdmin || Object.keys(newAdmin).length === 0) throw new Error(`Couldn't create the admin. from model. newAdmin: ${newAdmin}. newParams: ${JSON.stringify(newParams)}`);
            return newAdmin;
        }catch (err) {
            console.error(`Error creating the admin. ${err }`);
            throw err;
        }
    }

    static async deleteAdmin(adminId: number): Promise<boolean>{
        if(!adminId) throw new Error('Invalid parameters in function "deleteAdmin"');
        try {
            const [deletedAdmin] = await sql`UPDATE admin SET admin_status = 'I' WHERE id = ${adminId} RETURNING *`;
            if(!deletedAdmin || Object.keys(deletedAdmin).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error deleting the admin. ${err }`);
            return false;
        }

    }

    static async updateAdmin(adminDetails: Partial<UpdateAdminDTO>): Promise<boolean>{
        if(!adminDetails || Object.keys(adminDetails).length === 0) throw new Error('Invalid parameters in function "updateAdmin"');
        try {
            const {id: adminId, ...extractedDetails} = adminDetails;
            const [updatedAdmin] = await sql`UPDATE admin SET ${sql(extractedDetails)} WHERE id = ${adminId} RETURNING *`
            if(!updatedAdmin || Object.keys(updatedAdmin).length === 0) throw new Error(`Error updating the admin ${updatedAdmin}`);
            return true;
        }catch (err) {
            console.error(`Error updating the admin. ${err }`);
            throw err;
        }
    }

    static async getAllUsers(limit: number, offset: number): Promise<User[]>{
        if(!limit || !offset) throw new Error('Invalid parameters in function "getAllUsers" from admin');
        try {
            const users = await UserModel.getAllUSers(limit, offset);
            return users;
        }catch (err) {
            console.error(`Error getting the users from admin. ${err }`);
            return [];
        }
    }

    static async getUserById(userId: number): Promise<User | null>{
        if(!userId) throw new Error('Invalid parameter in function "getUserById" from admin');
        try {
            const user = await UserModel.getUserById(userId);
            return user;
        }catch (err) {
            console.error(`Error getting the user from admin ${err }`);
            return null;
        }
    }

    static async updateUser(userDetails: Partial<UpdateUserDTO>): Promise<boolean>{
        if(!userDetails || Object.keys(userDetails).length === 0) throw new Error('Invalid parameters in function "updateUser" from admin');
        try {
            const isUserUpdated = await UserModel.updateUser(userDetails);
            return isUserUpdated;
        }catch (err) {
            console.error(`Error updating the user from admin. ${err }`);
            return false;
        }
    }

    static async deleteUser(userId: number): Promise<boolean>{
        if(!userId) throw new Error('Invalid parameters in function "deleteUser" from admin');
        try {
            const isUserDeleted = await UserModel.deleteUser(userId);
            return isUserDeleted;
        }catch (err) {
            console.error(`Error deleting the user from admin. ${err }`);
            return false;
        }
    }

    static async getAllShipmentsByUserId(userId: number): Promise<Shipment[] | []>{
        if(!userId) throw new Error('Invalid parameters in function "getAllShipmentsByUserId from admin');
        try {
            const userShipments = await UserModel.getAllShipmentsByUserId(userId);
            return userShipments;
        }catch (err) {
            console.error(`Error getting the user shipments from admin. ${err }`);
            return [];
        }
    }

    static async getShipmentByTrackId(trackId: string): Promise<Shipment | null>{
        if(!trackId) throw new Error('Invalid parameters in function "getShipmentByTrackId" from admin');
        try {
            const shipment = await UserModel.getShipmentByTrackId(trackId);
            if(!shipment || Object.keys(shipment).length === 0) return null;
            return shipment
        }catch (err) {
            console.error(`Error getting the shipment by track_id from admin. ${err }`);
            return null;
        }
        
    }

    static async createVehicle(vehicleDetails: CreateVehicleDTO): Promise<Vehicle | null>{
        if(!vehicleDetails || Object.keys(vehicleDetails).length === 0) throw new Error('Invalid parameters in function "createVehicle" from admin');
        try {
            const newVehicle = await VehicleModel.createVehicle(vehicleDetails);
            return newVehicle;
        }catch (err) {
            console.error(`Error creating the vehicle from admin. ${err }`);
            return null;
        }
    }

    static async updateVehicle(vehicleDetails: UpdateVehicleDTO): Promise<boolean>{
        if(!vehicleDetails || Object.keys(vehicleDetails).length === 0) throw new Error('Invalid parameters in function "updateVehicle" from admin');
        try {
            const isVehicleUpdated = await VehicleModel.updateVehicle(vehicleDetails);
            return isVehicleUpdated;
        }catch (err) {
            console.error(`Error updating the vehicle from admin. ${err }`);
            return false;
        }
    }

    static async getAllVehicles(): Promise<Vehicle[] | []>{
        try {
            const vehicles = await VehicleModel.getAllVehicles();
            return vehicles;
        }catch (err) {
            console.error(`Error getting the vehicles from admin. ${err }`);
            return [];
        }
    }

    static async getVehicleById(vehicleId: number): Promise<Vehicle | null>{
        if(!vehicleId) throw new Error('Invalid parameters in function "getVehicleById" from admin');
        try {
            const vehicle = await VehicleModel.getVehicleById(vehicleId);
            return vehicle;
        }catch (err) {
            console.error(`Error getting the vehicle from admin. ${err }`);
            return null;
        }
    }

    static async deleteVehicle(vehicleId: number): Promise<boolean>{
        if(!vehicleId) throw new Error('Invalid parameters in function "deleteVehicle" from admin');
        try {
            const isVehicleDeleted = await VehicleModel.deleteVehicle(vehicleId);
            return isVehicleDeleted;
        }catch (err) {
            console.error(`Error deleting the vehicle from admin. ${err }`);
            return false;
        }
    }

    static async createCourier(courierDetails: CreateCourierDTO): Promise<Courier | null>{
        if(!courierDetails || Object.keys(courierDetails).length === 0) throw new Error('Invalid parameters in function "createCourier" from admin');
        try {
            const newCourier = await CourierModel.createCourier(courierDetails);
            if(!newCourier || Object.keys(newCourier).length === 0) return null;
            return newCourier;
        }catch (err) {
            console.error(`Error creating the courier from admin. ${err }`);
            return null;
        }
    }

    static async getAllCouriers(): Promise<Courier[] | []>{
        try {
            const couriers = await CourierModel.getAllCouriers();
            return couriers;
        }catch (err) {
            console.error(`Error getting the couriers from admin. ${err }`);
            return [];
        }
    }

    static async updateCourier(courierDetails: Partial<UpdateCourierDTO>): Promise<boolean>{
        if(!courierDetails || Object.keys(courierDetails).length === 0) throw new Error('Invalid parameters in function "updateCourier" from admin');
        try {
            const isCourierUpdated = await CourierModel.updateCourier(courierDetails);
            return isCourierUpdated;
        }catch (err) {
            console.error(`Error updating the courier from admin. ${err }`);
            return false;
        }
    }

    static async getCourierByDocumentId(documentId: number): Promise<Courier | null>{
        if(!documentId) throw new Error('Invalid parameters in function "getCourierByDocumentId" from admin');
        try {
            const courier = await CourierModel.getCourierByDocumentId(documentId);
            return courier;
        }catch (err) {
            console.error(`Error getting the courier by document from admin. ${err }`);
            return null;
        }
    }

    static async deleteCourier(courierId: number): Promise<boolean>{
        if(!courierId) throw new Error('Invalid parameters in function "deleteCourier" from admin');
        try {
            const isCourierDeleted = await CourierModel.deleteCourier(courierId);
            return isCourierDeleted;
        }catch (err) {
            console.error(`Error deleting the courier from admin. ${err }`);
            return false;
        }
    }

    static async validateUserDetailsToChangePassword(userDetails: UserDetailsValidationDTO){
        if(!userDetails || Object.keys(userDetails).length === 0) throw new Error('Invalid parameters in function "validateUserDetailsToChangePassword"');
        try {
            const {name, last_name, phone, email, document_id} = userDetails;
            const user = await sql`SELECT * FROM users WHERE name = ${name} AND last_name = ${last_name} AND phone = ${phone} AND email = ${email} AND document_id = ${document_id}`;
            if(!UserModel.isUserDetailsValidation(user)) return false;
            if(!user || Object.keys(user).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error validating the user details from admin. Password cannot be changed. ${err }`);
            return false;
        }
    }

    static async updateUserPassword(userDetails: UserDetailsPasswordUpdateDTO): Promise<boolean>{
        try {
            const {id, actualPassword, newPassword, name, last_name, phone, email, document_id} = userDetails;
            const isUserDetailsValid = this.validateUserDetailsToChangePassword({name, last_name, phone, email, document_id});
            if(!isUserDetailsValid) return false;
            const userDetailsValidated = {
                id,
                actualPassword,
                newPassword
            }
            const isPasswordUpdated = await UserModel.updatePassword(userDetailsValidated);
            return isPasswordUpdated;
        }catch (err) {
            console.error(`Error updating the user password from admin. ${err }`);
            return false;
        }
    }

    static async assignCourierToVehicle(courierId: number, vehicleId: number){
        if(!courierId || !vehicleId) throw new Error('Invalid parameters in function "assignCourierToVehicle" from admin');
        try {
            const isCourierAssigned = await CourierModel.assignCourierToVehicle(courierId, vehicleId);
            return isCourierAssigned;
        }catch (err) {
            console.error(`Error assigning the courier to a vehicle from admin. ${err }`);
            return false;
        }
    }

    static async removeCourierVehicle(courierId: number){
        if(!courierId) throw new Error('Invalid parameters in function "removeCourierVehicle"');
        try {
            const isVehicleRemoved = await CourierModel.removeCourierVehicle(courierId);
            return isVehicleRemoved;
        }catch (err) {
            console.error(`Error removing the vehicle from the courier from admin. ${err }`);
            return false;
        }
    }

    static async updateShipmentVehicle(shipmentId: number, vehicleId: number){
        if(!shipmentId || !vehicleId) throw new Error('Invalid parameters in function "updateShipmentVehicle" from admin');
        try {
            const isShipmentVehicleUpdated = await ShipmentModel.updateShipmentVehicle(shipmentId, vehicleId);
            return isShipmentVehicleUpdated;
        }catch (err) {
            console.error(`Error udpating the shipment vehicle from admin. ${err }`);
            return false;
        }
    }
}