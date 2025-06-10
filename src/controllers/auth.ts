import { CookieOptions, Request, Response } from "express"
import {OAuth2Client} from "google-auth-library"

import { logger } from "../logging/logger.js"
import {googleAuthschema, loginUserSchema, registerUserSchema, verifyOTPSchema} from "../schemas/auth.js"
import { hashPassword, verifyPassword } from "../utils/password.js";
import { getUserByEmail, saveUserToDB, updateUserVerifiedStatus } from "../database/utils.js";
import { generateOTP, isOTPExpired } from "../utils/otp.js";
import { sendEmail } from "../services/emailService.js";
import { createJwtToken } from "../utils/jwt.js";
import { db } from "../database/db.js";
import { userTable } from "../database/schema/user.js";

const client = new OAuth2Client();

enum Provider {
    GOOGLE = "google",
    CREDENTIALS = "credentials",
}

export const registerController = async (req: Request, res: Response) => {
    // validate request body with schema
    const {success, error, data: registerRequestBody} = registerUserSchema.safeParse(req.body);
    if(!success) {
        logger.error(`ERROR: registerController: Invalid request body : ${error.message}`);
        res.status(400).json({message: "Invalid request body"});
        return
    }

    try {
        // first check if user already exists
        const user = await getUserByEmail(registerRequestBody.email);
        if(user.length > 0 && user[0].isVerified) { // user exists and verified
            logger.error(`ERROR: registerController: User already exists: ${registerRequestBody.email}`);
            res.status(400).json({message: "Email already registered. Please sign in."});
            return
        } else if(user.length > 0 && !user[0].isVerified) { // user exists but not verified
            logger.error(`ERROR: registerController: User has not verified their email: ${registerRequestBody.email}`);
            res.status(400).json({message: "Please verify your email using the OTP we have sent."});
            return
        } else { // email does not exist
            const hashedPassword = await hashPassword(registerRequestBody.password);
            const Otp = generateOTP();

            await saveUserToDB({
                name: registerRequestBody.name,
                email: registerRequestBody.email,
                password: hashedPassword,
                provider: Provider.CREDENTIALS,
                otp: Otp,
                otpExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // OTP is valid only for 1 hour
            });

            await sendEmail(registerRequestBody.email, "OTP Verification", `Your OTP is ${Otp}`);

            res.status(201).json({message: "We have sent an OTP to your email. Please verify your account"});
        }
    } catch(error: any) {
        logger.error(`ERROR: registerController: Internal Server Error: ${error}`);
        res.status(500).json({error: "Something went wrong!"});
    }
}

export const verifyOtpController = async (req: Request, res: Response) => {
    const {success, error, data: verifyOtpRequestBody} = verifyOTPSchema.safeParse(req.body);
    if(!success) {
        logger.error(`ERROR: verifyOtpController: Invalid request body : ${error.message}`);
        res.status(400).json({message: "Invalid request body"});
        return
    }

    try {
        const user = await getUserByEmail(verifyOtpRequestBody.email);
        if(user.length>0 && user[0].isVerified) {
            logger.error(`ERROR: verifyOtpController: Already Verified email: ${verifyOtpRequestBody.email}`);
            res.status(400).json({message: "Email already verified. Please sign in."});
            return
        } else if(user.length>0 && !user[0].isVerified) {
            if(user[0].otp === verifyOtpRequestBody.otp) {
                if(isOTPExpired(new Date(user[0].otpExpiresAt))) {
                    logger.error(`ERROR: verifyOtpController: OTP Expired: ${verifyOtpRequestBody.email}`);
                    res.status(400).json({message: "OTP has expired. Please request a new OTP."});
                    return
                }

                await updateUserVerifiedStatus(verifyOtpRequestBody.email);
                res.status(200).json({message: "Email verified successfully."});
                return
            } else {
                logger.error(`ERROR: verifyOtpController: Incorrect OTP: ${verifyOtpRequestBody.email}`);
                res.status(400).json({message: "Invalid OTP"});
                return
            }
        }
    } catch(error: any) {
        logger.error(`ERROR: verifyOtpController: Internal Server Error: ${error}`);
        res.status(500).json({error: "Something went wrong!"});
    }
}

export const loginController = async (req: Request, res: Response): Promise<any> => {
    // validate request body with schema
    const {success, error, data: loginRequestBody} = loginUserSchema.safeParse(req.body);
    if(!success) {
        logger.error(`ERROR: loginController: Invalid request body : ${error.message}`);
        res.status(400).json({message: "Invalid request body"});
        return
    }

    try {
        // first check if user already exists
        const user = await getUserByEmail(loginRequestBody.email);
        if(user.length > 0 && user[0].isVerified) { // user exists and verified
            // check password match
            const isPasswordMatch = await verifyPassword(loginRequestBody.password, user[0].password);
            if(!isPasswordMatch) {
                logger.error(`ERROR: loginController: Invalid password: ${loginRequestBody.email}`);
                res.status(400).json({message: "Invalid password"});
                return
            }

            // create jwt token
            const userPayload = {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email
            }
            const token = createJwtToken(userPayload);

            // save the token in cookie
            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                domain: "localhost",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000
            }
            res.cookie("token", token, cookieOptions);

            res.status(200).json({ message: "Login successful", user: userPayload, token });
        } else if(user.length > 0 && !user[0].isVerified) { // user exists but not verified
            logger.error(`ERROR: loginController: User has not verified their email: ${loginRequestBody.email}`);
            res.status(400).json({message: "Please verify your email. Use the OTP that went had sent or request a new one."});
            return
        } else { // email does not exist
            res.status(400).json({message: "User not found. Please  Sign Up."});
        }
    } catch(error: any) {
        logger.error(`ERROR: loginController: Internal Server Error: ${error}`);
        res.status(500).json({error: "Something went wrong!"});
    }
}

export const logoutController = async (req: Request, res: Response): Promise<any> => {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({message: "Logout successful"});
}

export const googleAuthController = async (req: Request, res: Response) => {
    const {success, error, data: googleAuthRequestBody} = googleAuthschema.safeParse(req.body);
    if(!success) {
        logger.error(`ERROR: googleAuthController: Invalid request body : ${error.message}`);
        res.status(400).json({message: "Invalid request body"});
        return
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleAuthRequestBody.credential,
            audience: googleAuthRequestBody.clientId,
        });

        const payload = ticket.getPayload();

        // check if user exists in DB or not
        const user =await getUserByEmail(payload["email"]);
        if(user.length > 0 && user[0].isVerified && user[0].provider === Provider.GOOGLE) {
            logger.error(`ERROR: googleAuthController: User already exists: ${payload["email"]}`);
            res.status(200).json({message: "Redirecting to Dashboard."});
            return
        } else if(user.length>0 && user[0].isVerified && user[0].provider === Provider.CREDENTIALS) {
            await db.update(userTable).set({
                provider: `${Provider.GOOGLE}_${Provider.CREDENTIALS}`,
                profileUrl: payload["picture"]
            })

            if(googleAuthRequestBody.type === "login") {
                res.status(200).json({message: "Login successful"});
                return
            } else if(googleAuthRequestBody.type === "signup") {
                res.status(201).json({message: "Sign Up successful!"});
                return
            }
        } else { //  email does not exist or not verified
            await saveUserToDB({
                name: payload["name"],
                email: payload["email"],
                provider: Provider.GOOGLE,
                profileUrl: payload["picture"],
                isVerified: payload["email_verified"]
            })

            // create jwt token
            const userPayload = {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email
            }
            const token = createJwtToken(userPayload);

            // save the token in cookie
            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                domain: "localhost",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000
            }
            res.cookie("token", token, cookieOptions);

            if(googleAuthRequestBody.type === "login") {
                res.status(200).json({ message: "Login successful", user: userPayload, token });
                return
            } else if(googleAuthRequestBody.type === "signup") {
                res.status(201).json({message: "Sign Up successful!", user: userPayload, token});
                return
            }
        }
    } catch(error : any) {
        logger.error(`ERROR: googleAuthController: Internal Server Error: ${error}`);
        res.status(500).json({error: "Something went wrong!"});
    }
}