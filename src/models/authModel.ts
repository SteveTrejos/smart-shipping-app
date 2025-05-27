import { sql } from "bun";
import type { CreateRecoveryPasswordDTO } from "../dto/auth/createRecoveryPassword.dto";

export class AuthModel{
    static async insertRecoveryPassword(recoveryPasswordDetails: CreateRecoveryPasswordDTO){
        try {
            if(!recoveryPasswordDetails || Object.keys(recoveryPasswordDetails).length === 0) throw new Error('Invalid parameters in function "insertRecoveryPassword" from auth.');
            const [newDetails] = await sql`INSERT INTO recovery_password_codes ${sql(recoveryPasswordDetails)} RETURNING *`;
            if(!newDetails || Object.keys(newDetails).length === 0) return null;
            return newDetails;
        }catch (err) {
            console.error(`Error creating the recovery password. ${err }`);
            throw err;
        }
    }
}