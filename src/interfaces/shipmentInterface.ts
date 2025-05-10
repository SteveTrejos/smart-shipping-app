export interface Shipment{
    id: number;
    user_id: number;
    destination_address: string;
    origin_address: string;
    shipment_status: string;
    packaging_type: string;
    track_id: string;
    vehicle_id: number;
    estimated_arrival_time: string;
    weight: number;
    created_at: string;
    updated_at: string;
}