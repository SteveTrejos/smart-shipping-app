import { sql } from "bun";
import type { CreateRecoveryPasswordDTO } from "../dto/auth/createRecoveryPassword.dto";
import type { recoveryDataDTO } from "../dto/auth/recoveryData.dto";
import { UserModel } from "./usersModel";
import type { UserPasswordUpdateDTO } from "../dto/users/userPasswordUpdate.dto";

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

    static async getRecoveryData(userId: number, userRecoveryCode: number): Promise<recoveryDataDTO>{
        if(!userId || !userRecoveryCode) throw new Error('Invalid parameters in function "getRecoveryData" from auth.');
        try {
            const recoveryData = await sql`SELECT * FROM recovery_password_codes WHERE user_id = ${userId} AND recovery_code = ${userRecoveryCode}`;
            return recoveryData[0] || {};
        }catch (err) {
            console.error(`Error getting the recovery data ${err }`);
            throw err;
        }
    }

    static async updateRecoveryDataStatus(userId: number, userRecoveryCode: number){
        if(!userId || !userRecoveryCode) throw new Error('Invalid parameters in function "getRecoveryData" from auth.');
        try {
            const isStatusUpdated = await sql`UPDATE recovery_password_codes SET used = true WHERE user_id = ${userId} AND recovery_code = ${userRecoveryCode} RETURNING *`;
            if(!isStatusUpdated) throw new Error('There was an error updating the code status');
            return;
        }catch (err) {
            console.error(`Error updating the recovery status. ${err }`);
            throw err;
        }
    }

    static async updatePassword(user: UserPasswordUpdateDTO): Promise<boolean>{
        if(!user || Object.keys(user).length === 0) throw new Error('Invalid user parameters in function "updatePassword" from auth');
        try {
            const passwordUpdated = await UserModel.updatePassword(user);
            return passwordUpdated;
        } catch (err: any) {
            throw err;
        }
    }
}