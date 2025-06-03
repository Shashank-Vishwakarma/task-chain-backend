import {z} from "zod";

export const RegisterUserSchema = z.object({
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