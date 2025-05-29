export interface recoveryDataDTO{
    id: number;
    user_id: number;
    recovery_code: number;
    used: boolean;
    expiration_date: string;
    created_at: string;
}