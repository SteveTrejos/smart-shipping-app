import { sql } from "bun";
import type { CreateShipmentDTO } from "../dto/shipments/createShipment.dto";
import type { Shipment } from "../interfaces/shipmentInterface";

export class ShipmentModel{
    static async createShipment(shipment: CreateShipmentDTO): Promise<Shipment | null>{
        if(!shipment) throw new Error('Invalid parameters on function "createShipment"');
        try{
            const [result] = await sql`INSERT INTO shipments ${sql(shipment)} RETURNING *`;
            return result || null;
        }catch(err){
            console.error(`Error creating the shipment. ${err}`);
            throw err;
        }
    }

    static async cancelShipmentById(shipmentId: number, userId: number): Promise<boolean>{
        if(!shipmentId || !userId) throw new Error('Invalid parameters on function "cancelShipmentById"');
        try{
            const shipment = await sql`SELECT * FROM shipments WHERE id = ${shipmentId} AND shipment_status = 'A' AND user_id = ${userId}`;
            if(shipment.length > 0){
            const {shipment_status} = shipment[0];
            if(shipment_status === 'P' || shipment_status === 'A'){
                await sql`UPDATE shipments SET shipment_status = 'I' WHERE id = ${shipmentId} AND user_id = ${userId}`;
                return true;
            }
            }
            return false;
        }catch(err){
            console.error(`Error cancelling the shipment. ${err}`);
            throw err;
        }
    }

    static async getShipmentById(shipmentId: number): Promise<Shipment | null>{
        if(!shipmentId) throw new Error('Invalid parameters on function "getShipmentById"');
        try{
            const result = await sql`SELECT * FROM shipments WHERE id = ${shipmentId} AND shipment_status = 'A' AND EXISTS (SELECT 1 FROM shipments WHERE id = ${shipmentId}`;
            return result || null;
        }catch(err){
            console.error(`Error getting the shipment. ${err}`);
            return null;
        }
    }

    static async getShipmentByTrackId(trackId: string): Promise<Shipment | null>{
        if(!trackId) throw new Error('Invalid parameters in function "getShipmentByTrackId"');
        try {
            const [shipment] = await sql`SELECT * FROM shipments WHERE track_id = ${trackId}`;
            if(!shipment || Object.keys(shipment).length === 0) return null;
            return shipment;
        }catch (err) {
            console.error(`Error getting the shipment. ${err }`);
            return null;
        }
    }

    static async updateShipmentVehicle(shipmentId: number, vehicleId: number){
        if(!shipmentId || !vehicleId) throw new Error('Invalid parameters in function "updateShipmentVehicle"');
        try {
            const [updatedShipment] = await sql`UPDATE shipments SET vehicle_id = ${vehicleId} WHERE id = ${shipmentId} RETURNING *`;
            if(!updatedShipment || Object.keys(updatedShipment).length === 0) return false;
            return true;
        }catch (err) {
            console.error(`Error updating the shipment vehicle. ${err }`);
            return false;
        }
    }

}