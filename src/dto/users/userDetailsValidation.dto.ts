//this interface is used to validate the user data and then update the password if 
//everything matches
export interface UserDetailsValidationDTO{
    name: string;
    last_name: string;
    phone: string;
    email: string;
    document_id: string;
}