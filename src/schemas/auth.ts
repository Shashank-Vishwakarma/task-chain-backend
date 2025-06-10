import {z} from "zod";

export const registerUserSchema = z.object({
    name: z.string({message: "name is required"}).min(1),
    email: z.string({message: "email is required"}).email(),
    password: z.string({message: "password is required"}).min(6),
    confirm_password: z.string({message: "confirm_password is required"}).min(6),
}).superRefine(({password, confirm_password}, ctx)=>{
    if(password !== confirm_password) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirm_password"],
        });
    }
})

export const googleAuthschema = z.object({
    credential: z.string({message: "credential is required"}),
    clientId: z.string({message: "clientId is required"}),
    type: z.string({message: "type is required"}),
}).superRefine(({type}, ctx)=>{
    if(type !== "login" && type !== "signup") {
        ctx.addIssue({
            code: "custom",
            message: "type must be login or signup",
            path: ["type"],
        })
    }
})

export const verifyOTPSchema = z.object({
    email: z.string({message: "email is required"}).email(),
    otp: z.string({message: "otp is required"}).min(6).max(6),
})

export const loginUserSchema = z.object({
    email: z.string({message: "email is required"}).email(),
    password: z.string({message: "password is required"}).min(6),
})