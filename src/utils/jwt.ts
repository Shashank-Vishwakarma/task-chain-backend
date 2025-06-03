import jwt from "jsonwebtoken"

export interface User {
    id: string,
    name: string,
    email: string
}

export const createJwtToken = (payload: User) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"});
    return token
}

export const verifyJwtToken = (token: string) => {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    return decodedPayload
}