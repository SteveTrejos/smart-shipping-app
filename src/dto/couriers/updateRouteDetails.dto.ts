export interface UpdateRouteDetailsDTO{
    id: number;
    courier_id: number;
    origin_place: string;
    destination_place: string;
    departure_time: string;
    arrival_time: string;
}