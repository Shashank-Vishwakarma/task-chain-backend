import express from "express";
import { Express } from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

import verifyEnvConfig, { Config } from "./config/config.js";
import authRouter from "./routes/auth.js";

// verify any missing environment variables
verifyEnvConfig(Config);

const app: Express = express();

// Parse request body
app.use(express.json())

// Parse cookies from request
app.use(cookieParser())

// cors setup
app.use(cors())

// Register Routes
app.use("/api/v1/auth", authRouter);

app.listen(Config.APPLICATION_PORT, ()=>{
    console.log(`Server is running on port ${Config.APPLICATION_PORT}`);
})