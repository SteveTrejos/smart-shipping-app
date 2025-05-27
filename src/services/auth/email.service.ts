import crypto from 'crypto';
import { Resend, type CreateEmailResponseSuccess, type ErrorResponse } from 'resend';
export class EmailService{
    static async sendPasswordRecoveryEmail(emailTo: string, randomCode: number): Promise<{error: ErrorResponse | null, data: CreateEmailResponseSuccess | null, randomCode: number}> {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const { data, error } = await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: [emailTo],
                subject: `Hello user, your recovery code is ${randomCode}`,
                text: `Hello user, your recovery code is ${randomCode}`
            });
            return {
                data,
                randomCode,
                error,
            }
        } catch (err: any) {
            throw err;
        }
    }

    static generateRandomCode(): number{
        return crypto.randomInt(100000, 999999);
    }
}