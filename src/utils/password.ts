import {hash, genSalt, compare} from "bcryptjs"

export const hashPassword = async (password: string) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isPasswordMatch = await compare(password, hashedPassword);
    return isPasswordMatch
}