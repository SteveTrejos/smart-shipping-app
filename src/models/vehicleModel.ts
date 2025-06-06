import { sql } from "bun";
import type { Vehicle } from "../interfaces/vehicleInterface";
import type { CreateVehicleDTO } from "../dto/vehicles/createVehicle.dto";
import type { UpdateVehicleDTO } from "../dto/vehicles/updateVehicle.dto";

export class VehicleModel{
    static async createVehicle(vehicle: CreateVehicleDTO): Promise<Vehicle>{
        try {
            if(!vehicle) throw new Error('Invalid parameter in function "createVehicle"');
            if(!vehicle || Object.keys(vehicle).length === 0) throw new Error('Vehicles params not found');
            const [newVehicle] = await sql`INSERT INTO vehicles ${sql(vehicle)} RETURNING *`;
            return newVehicle;
        }catch (err) {
            console.error(`Error creating the vehicle. ${err }`);
            throw err;
        }
    }

    static async updateVehicle(vehicle: UpdateVehicleDTO): Promise<Vehicle>{
        try {
            if(!vehicle) throw new Error('Invalid parameter in function "updateVehicle"');
            const {id: vehicleId, ...fieldsToUpdate} = vehicle;
            if(!vehicleId || Object.keys(fieldsToUpdate).length === 0) throw new Error(`Invalid params`);
            const [updatedVehicle] = await sql`UPDATE vehicles SET ${sql(fieldsToUpdate)} WHERE id = ${vehicleId} RETURNING *`;
            if(!updatedVehicle || Object.keys(updatedVehicle).length === 0) throw new Error(`Couldn't update the vehicle`);
            return updatedVehicle;
        }catch (err) {
            console.error(`Error updating the vehicle. ${err}`);
            throw err;
        }
    }

    static async deleteVehicle(vehicleId: number): Promise<boolean>{
        if(!vehicleId) throw new Error('Invalid parameters in function "deleteVehicle"');
        try {
            const [deletedVehicle] = await sql`UPDATE vehicles SET vehicle_status = 'I' WHERE id = ${vehicleId} RETURNING *`;
            if(!deletedVehicle || Object.keys(deletedVehicle).length === 0) throw new Error(`Couldn't delete the vehicle, vehicle not found`);
            return true;
        }catch (err) {
            console.error(`Error deleting the vehicle. ${err }`);
            throw err;
        }
    }

    static async getAllVehicles(): Promise<Vehicle[]>{
        try {
            const result = await sql`SELECT * FROM vehicles WHERE vehicle_status = 'A' ORDER BY id`;
            if(!result || result.length === 0) return [];
            return result;
        }catch (err) {
            console.error(`Error getting the vehicles. ${err }`);
            return [];
        }
    }

    static async getVehicleById(vehicleId: number): Promise<Vehicle | null>{
        if(!vehicleId) throw new Error('Invalid parameters in function "getVehicleById"');
        try {
            const [vehicle] = await sql`SELECT * FROM vehicles WHERE id = ${vehicleId} and vehicle_status = 'A'`;
            if(!vehicle) return null;
            return vehicle;
        }catch (err) {
            console.error(`Error getting the vehicle. ${err }`);
            throw err;
        }
    }
}