import express from "express";
import { Express } from "express";
import verifyEnvConfig, { Config } from "./config/config.js";

// verify any missing environment variables
verifyEnvConfig(Config)

const app: Express = express();

app.listen(Config.PORT, ()=>{
    console.log(`Server is running on port ${Config.PORT}`);
})