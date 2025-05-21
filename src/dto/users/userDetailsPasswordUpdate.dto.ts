export interface UserDetailsPasswordUpdateDTO{
    id: number;
    actualPassword: string;
    newPassword: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    document_id: string;
}