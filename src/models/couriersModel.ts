import { sql } from "bun";
import type { Courier } from "../interfaces/courierInterface";
import type { CreateCourierDTO } from "../dto/couriers/createCourier.dto";
import type { UpdateCourierDTO } from "../dto/couriers/updateCourier.dto";

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
            if(err instanceof Error){
                throw new Error(`Error getting the couriers. ${err.message}`);
            }
            return [];
        }
    }

    static async updateCourier(courier: UpdateCourierDTO): Promise<boolean>{
        if ( courier === null || courier === undefined ) throw new Error('Invalid parameters at "updateCourier"');
        try{
            const {id, ...fieldsToUpdate} = courier;
            const [updatedCourier] = await sql`UPDATE couriers SET ${sql(fieldsToUpdate)} WHERE id = ${id} RETURNING *`;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) return false;
            return true;
        }catch(err){
            if ( err instanceof Error){
                throw new Error(`Error updating the courier. ${err.message}`)
            }
            return false;
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

    static async deleteCourier(courierId: number): Promise<boolean>{
        try{
            if(!courierId) throw new Error('Invalid parameters in function "deleteCourier"');
            const [updatedCourier] = await sql`UPDATE couriers SET courier_status = 'I' WHERE id = ${courierId} RETURNING *`;
            if(!updatedCourier || Object.keys(updatedCourier).length === 0) return false;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error deleting the courier. ${err.message}`);
            }
            return false;
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

    static async updateCourierVehicle(courierId: number, vehicleId: number): Promise<boolean>{
        if(!courierId || !vehicleId) throw new Error(`Invalid parameters at "updateCourierVehicle"`);

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

    static async updateArrivalTime(){
        
    }

    static async updateRouteDetails(){

    }

    static async updateDepartureTime(){

    }
}