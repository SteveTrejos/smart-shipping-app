import type { Request, Response } from "express";
import { EmailService } from "../services/auth/email.service";
import { AuthModel } from "../models/authModel";
import { UserModel } from "../models/usersModel";

export class AuthController{
    static async sendPasswordRecoveryEmail(req: Request, res: Response): Promise<void> {
        const emailTo: string = req.body.emailTo;
        try {
            if (!emailTo) {
                res.status(400).json({ message: `Invalid email.` });
                return;
            }
            const user = await UserModel.getUserByEmail(emailTo);
            if (!user) {
                res.status(400).json({ message: `Email is not from a registered user.` });
                return;
            }

            const randomCode = EmailService.generateRandomCode();
            const newDetails = await AuthModel.insertRecoveryPassword({
                user_id: user.id,
                recovery_code: randomCode,
                used: false
            });

             if (!newDetails) {
                res.status(400).json({ message: `Error inserting recovery details.` });
                return;
            }
            
            const response = await EmailService.sendPasswordRecoveryEmail(emailTo, randomCode);
            if (response.error) {
                res.status(500).json({ message: `Error sending the recovery email.`, error: response.error });
                return;
            }

            res.status(200).json({
                message: `Email sent successfully`,
                data: response.data
            });

        } catch (err: any) {
            res.status(500).json({ message: `Couldn't process the recovery request`, error: err.message });
        }
    }

    static async validateRecoveryCode(req: Request, res: Response): Promise<void>{
        try {
            const {user_id, recovery_code: userRecoveryCode} = req.body;
            const recoveryData = await AuthModel.getRecoveryData(user_id, userRecoveryCode);

            if(!recoveryData){
                res.status(400).json({message: `Invalid parameters`, data: recoveryData});
                return;
            }

            const {recovery_code: dbCode, used, expiration_date} = recoveryData;
            
            if(Date.now() > Date.parse(expiration_date)){
                res.status(400).json({message: `The code has expired.`});
                return;
            }

            if(used){
                res.status(400).json({message: `The recovery code was already used`});
                return;
            }

            if(!dbCode){
                res.status(400).json({message: `Invalid code. ${userRecoveryCode}`});
                return;
            }

            if(Number(userRecoveryCode) !== Number(dbCode)){
                res.status(400).json({message: `Invalid code. ${userRecoveryCode}`, data: recoveryData});
                return;
            }

            res.status(200).json({message: `Code validated correctly`});
            AuthModel.updateRecoveryDataStatus(user_id, userRecoveryCode);
        } catch (err: any) {
            res.status(500).json({message: `Couldn't validate the code.`, error: err.message});
        }
    }
}