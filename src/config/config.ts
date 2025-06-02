import "dotenv/config";

import { EnvConfig } from "../types/config.js";

export const Config: EnvConfig = {
    PORT: parseInt(process.env.APPLICATION_PORT),
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: parseInt(process.env.REDIS_PORT),
        USERNAME: process.env.REDIS_USERNAME,
        PASSWORD: process.env.REDIS_PASSWORD
    },
    POSTGRES: {
        HOST: process.env.POSTGRES_HOST,
        PORT: parseInt(process.env.POSTGRES_PORT),
        USERNAME: process.env.POSTGRES_USER,
        PASSWORD: process.env.POSTGRES_PASSWORD,
        DATABASE: process.env.POSTGRES_DATABASE,
    }
}

export default function verifyEnvConfig(config: EnvConfig) {
    for(const key in config) {
        if(typeof config[key] === "object") {
            verifyEnvConfig(config[key])
        }

        if(config[key] === undefined) {
            throw new Error(`Environment variable ${key} not found`);
        }
    }
}
