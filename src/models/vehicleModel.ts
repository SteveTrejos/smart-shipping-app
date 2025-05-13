import { sql } from "bun";
import type { Vehicle } from "../interfaces/vehicleInterface";

export class VehicleModel{
    static async createVehicle(vehicle: Vehicle){
        try {
            
        }catch (err) {
            console.error(`Error creating the vehicle. ${err }`);
            return null;
        }
        const [insertVehicle] = await sql`INSERT INTO vehicles ${sql(vehicle)}`;
        return vehicle
    }
}