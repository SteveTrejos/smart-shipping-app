import { sql } from "bun";
import type { Courier } from "../interfaces/courierInterface";
import type { CreateCourierDTO } from "../dto/couriers/createCourier.dto";
import type { UpdateCourierDTO } from "../dto/couriers/updateCourier.dto";
import type { UpdateArrivalTimeDTO } from "../dto/couriers/updateArrivalTime.dto";
import type { UpdateRouteDetailsDTO } from "../dto/couriers/updateRouteDetails.dto";
import type { UpdateDepartureTimeDTO } from "../dto/couriers/updateDepartureTime.dto";
import type { CreateVehicleRouteDTO } from "../dto/vehicleRoute/createVehicleRoute.dto";
import type { VehicleRoute } from "../interfaces/vehicleRouteInterface";
import { VehicleRouteModel } from "./VehicleRoutesModel";

export class CourierModel{
    static async createCourier(courier: CreateCourierDTO): Promise<Courier | null>{
        if(!courier || Object.keys(courier).length === 0) throw new Error(`Invalid parameters at "createCourier"`);
        try{
            const [newCourier] = await sql`
                INSERT INTO couriers ${sql(courier)} RETURNING *
            `;
            if(!newCourier || Object.keys(newCourier).length === 0) return null;
            return newCourier;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error creating the courier. ${err.message}`);
            }
            return null;
        }
    }

    static async getAllCouriers(): Promise<Courier[] | []>{
        try{
            return await sql`
                SELECT * FROM couriers WHERE courier_status = 'A' ORDER BY id
            `;
        }catch(err){
            throw err;
        }
    }

    static async updateCourier(courier: Partial<UpdateCourierDTO>): Promise<boolean>{
        if ( courier === null || courier === undefined ) throw new Error('Invalid parameters at "updateCourier"');
        try{
            const {id, ...fieldsToUpdate} = courier;
            const [updatedCourier] = await sql`UPDATE couriers SET ${sql(fieldsToUpdate)} WHERE id = ${id} RETURNING *`;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) throw new Error('Updated courier not found');
            return true;
        }catch(err){
            throw err;
        }
    }

    static async getCourierById(id: number): Promise<Courier | null>{
        if ( !id ) throw new Error('Invalid courier id parameter');
        try{
            const [courier] = await sql`
            SELECT * FROM couriers WHERE id = ${id} AND courier_status = 'A'
            `;
            if(!courier || Object.keys(courier).length === 0) return null;
            return courier;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error getting the courier. ${err.message}`);
            }
            return null;
        }
    }

    static async getCourierByDocumentId(documentId: number): Promise<Courier | null>{
        if(!documentId) throw new Error('Invalid parameters in function "getCourierByDocumentId"');
        try {
            const courier = await sql`SELECT * FROM couriers WHERE document_id = ${documentId}`;
            if(!courier || Object.keys(courier).length === 0) return null;
            return courier;
        }catch (err) {
            console.error(`Error getting the courier. ${err }`);
            return null;
        }

    }

    static async deleteCourier(courierId: number): Promise<boolean>{
        try{
            if(!courierId || !Number.isInteger(courierId)) throw new Error('Invalid parameters in function "deleteCourier"');
            const [deletedCourier] = await sql`UPDATE couriers SET courier_status = 'I' WHERE id = ${courierId} RETURNING *`;
            if(!deletedCourier || Object.keys(deletedCourier).length === 0) throw new Error('Deleted courier not found');
            return true;
        }catch(err){
            throw err;
        }
    }

    static async updateCourierStatus(courierId: number): Promise<boolean>{
        if(!courierId) throw new Error(`Invalid parameter at "updateCourierStatus"`);
        try{
            const [updatedCourier] = await sql`
                UPDATE couriers SET available = (CASE WHEN available = true THEN false WHEN available = false THEN true END) WHERE id = ${courierId} RETURNING *
            `;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) return false;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error updating courier status. ${err.message}`);
            }
            return false;
        }
    }

    static async assignCourierToVehicle(courierId: number, vehicleId: number): Promise<boolean>{
        if(!courierId || !vehicleId) throw new Error(`Invalid parameters at "assignCourierToVehicle"`);

        try{
            const [updatedCourier] = await sql`
                UPDATE couriers SET vehicle_id = ${vehicleId} WHERE id = ${courierId} RETURNING *
            `;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) return false;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error updating couriers vehicle. ${err.message}`);
            }
            return false;
        }
    }

    static async removeCourierVehicle(courierId: number){
        if(!courierId) throw new Error('Invalid parameters in function "removeCourierVehicle"');
        try {
            const updatedCourier = await sql`UPDATE couriers SET vehicle_id = null WHERE id = ${courierId} RETURNING *`;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error removing the vehicle from the courier. ${err }`);
            return false;
        }
    }

    static async updateArrivalTime(details: Partial<UpdateArrivalTimeDTO>): Promise<boolean>{
        if(!details || Object.keys(details).length === 0) throw new Error('Invalid parameters in function "updateArrivalTime"');
        try {
            const {id, ...fieldsToUpdate} = details;
            const [updatedVehicleRoute] = await sql`UPDATE vehicle_routes SET ${sql(fieldsToUpdate)} WHERE id = ${id} RETURNING *`;
            if(!updatedVehicleRoute || Object.keys(updatedVehicleRoute).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error updating the arrival time. ${err }`);
            return false;
        }
    }

    static async updateRouteDetails(details: Partial<UpdateRouteDetailsDTO>): Promise<boolean>{
        if(!details || Object.keys(details).length === 0) throw new Error('Invalid parameters in function "updateRouteDetails"');
        try {
            const {id, ...fieldsToUpdate} = details;
            const [updatedVehicleRoute] = await sql`UPDATE vehicle_route SET ${sql(fieldsToUpdate)} WHERE id = ${id} RETURNING *`;
            if(!updatedVehicleRoute || Object.keys(updatedVehicleRoute).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error updating the vehicle route details. ${err }`);
            return false;
        }
    }

    static async updateDepartureTime(details: Partial<UpdateDepartureTimeDTO>): Promise<boolean>{
        if(!details || Object.keys(details).length === 0) throw new Error('Invalid parameters in function "updateDepartureTime"');
        try {
            const {id, ...fieldsToUpdate} = details;
            const [updatedVehicleRoute] = await sql`UPDATE vehicle_route SET ${fieldsToUpdate} WHERE id = ${id} RETURNING *`
            if(!updatedVehicleRoute || Object.keys(updatedVehicleRoute).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error updating the departure time. ${err }`);
            return false;
        }
    }

    static async createVehicleRoute(routeDetails: CreateVehicleRouteDTO): Promise<VehicleRoute | null>{
        if(!routeDetails || Object.keys(routeDetails).length === 0) throw new Error('Invalid parameters in function "createVehicleRoute from courier');
        try {
            const newVehicleRoute = await VehicleRouteModel.createVehicleRoute(routeDetails);
            if(!newVehicleRoute || Object.keys(newVehicleRoute).length === 0) return null;
            return newVehicleRoute;
        }catch (err) {
            console.error(`Error creating the vehicle route from courier.  ${err }`);
            return null;
        }
    }
}