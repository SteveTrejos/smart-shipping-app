export interface CreateShipmentDTO{
    user_id: number;
    destination_address: string;
    origin_address: string;
    packaging_type: string;
    weight: number;
}