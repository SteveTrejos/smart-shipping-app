export interface VehicleRoute{
    id: number;
    vehicle_id: number;
    vehicle_weight: number;
    origin_place: string;
    destination_place: string;
    departure_time: string;
    arrival_time: string;
    admin_id: string;
    courier_id: string | null;
    created_at: string | null;
    updated_at: string | null;
}