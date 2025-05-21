import { sql } from "bun";
import type { CreateVehicleRouteDTO } from "../dto/vehicleRoute/createVehicleRoute.dto";
import type { VehicleRoute } from "../interfaces/vehicleRouteInterface";

export class VehicleRouteModel{
    static async createVehicleRoute(routeDetails: CreateVehicleRouteDTO): Promise<VehicleRoute | null>{
        if(!routeDetails || Object.keys(routeDetails).length === 0) throw new Error('Invalid parameters in function "createVehicle"');
        try {
            const [newVehicleRoute] = await sql`INSERT INTO vehicle_routes ${sql(routeDetails)} RETURNING *`;
            if(!newVehicleRoute || Object.keys(newVehicleRoute).length === 0) return null;
            return newVehicleRoute;
        }catch (err) {
            console.error(`Error creating the vehicle route. ${err }`);
            return null;
        }
    }
}