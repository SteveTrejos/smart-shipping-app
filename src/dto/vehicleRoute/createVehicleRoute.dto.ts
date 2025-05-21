export interface CreateVehicleRouteDTO{
    vehicle_id: number;
    vehicle_weight: number;
    origin_place: string;
    destination_place: string;
    departure_time: string;
    admin_id: number | null;
    courier_id: number | null;
}