export interface CreateRecoveryPasswordDTO{
    user_id: number;
    recovery_code: number;
    used: boolean;
}