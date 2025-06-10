import {createTransport} from "nodemailer"
import { Config } from "../config/config.js"

export const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transport = createTransport({
            host: Config.EMAIL.SMTP_HOST,
            port: Config.EMAIL.SMTP_PORT,
            secure: false,
            auth: {
                user: Config.EMAIL.SMTP_USER,
                pass: Config.EMAIL.SMTP_PASSWORD
            }
        })
    
        await transport.sendMail({
            from: Config.EMAIL.EMAIL_FROM,
            to: email,
            subject: subject,
            html: text
        })
    } catch(error: any) {
        console.log(`Error: sendEmail: couldn't send email: ${error}`);
    }
}