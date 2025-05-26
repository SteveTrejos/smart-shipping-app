import type { Request, Response } from "express";
import { EmailService } from "../services/auth/email.service";

export class AuthController{
    static async sendPasswordRecoveryEmail(req: Request, res: Response): Promise<void>{
        const emailTo: string = req.body.emailTo;
        try {
            if(!emailTo){
                res.status(400).json({message: `Invalid email. ${emailTo}`});
                return;
            }
            const response = await EmailService.sendPasswordRecoveryEmail(emailTo);
            if(response.error){
                res.status(500).json({message: `An error ocurred sending the email`});
            };
            res.status(200).json({message: `Email sended succesfully`, data: response.data});
            
        } catch (err: any) {
            res.status(500).json({message: `Couldn't generate the recovery code`, error: err.message})
        }
    }
}