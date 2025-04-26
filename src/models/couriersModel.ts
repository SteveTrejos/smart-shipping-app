import { sql } from "bun";
import type { Courier } from "../interfaces/courierInterface";

export class CourierModel{
    static async createCourier(courier: Courier): Promise<Courier | null>{
        if(courier === undefined || courier === null || !courier) throw new Error(`Invalid parameters at "create courier"`);
        try{
            const [newCourier] = await sql`
                INSERT INTO couriers ${sql(courier)} RETURNING *
            `;
            return newCourier;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error creating the courier. ${err.message}`);
            }
            return null;
        }
    }

    static async getCourierById(id: number): Promise<Courier | null>{
        if ( !id ) throw new Error('Invalid courier id parameter');
        try{
            const [courier] = await sql`
            SELECT * FROM couriers WHERE id = ${id}
            `;
            return courier || null;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error getting the courier. ${err.message}`);
            }
            return null;
        }
    }

    static async updateCourier(courier: Partial<Courier>): Promise<boolean>{
        if ( courier === null || courier === undefined ) throw new Error('Invalid parameters at "updateCourier"');
        try{
            const {id} = courier;
            await sql`UPDATE couriers SET ${sql(courier)} WHERE id = ${id}`;
            return true;
        }catch(err){
            if ( err instanceof Error){
                throw new Error(`Error updating the courier. ${err.message}`)
            }
            return false;
        }
    }

    static async updateCourierStatus(courierId: number): Promise<boolean>{
        if(!courierId) throw new Error(`Invalid parameter at "updateCourierStatus"`);
        try{
            await sql`
                UPDATE couriers SET available = (CASE WHEN available = true THEN false WHEN available = false THEN true END) WHERE id = ${courierId}
            `;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error updating courier status. ${err.message}`);
            }
            return false;
        }
    }

    static async updateCourierVehicle(courierId: number, vehicleNumber: number): Promise<boolean>{
        if(!courierId || !vehicleNumber || courierId === undefined || courierId === null || vehicleNumber === undefined || vehicleNumber === null) throw new Error(`Invalid parameters at "updateCourierVehicle"`);

        try{
            await sql`
                UPDATE couriers SET vehicle_number = ${vehicleNumber} WHERE id = ${courierId}
            `;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error updating couriers vehicle. ${err.message}`);
            }
            return false;
        }
    }

    static async getAllCouriers(): Promise<Courier[] | null>{
        try{
            return await sql`
                SELECT * FROM couriers ORDER BY id
            `;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error getting the couriers. ${err.message}`);
            }
            return null;
        }
    }

    static async deleteCourier(courierId: number): Promise<boolean>{
        try{
            await sql`DELETE FROM couriers WHERE id = ${courierId}`;
            return true;
        }catch(err){
            if(err instanceof Error){
                throw new Error(`Error deleting the courier. ${err.message}`);
            }
            return false;
        }
    }
}