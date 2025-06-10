import "dotenv/config";

import { EnvConfig } from "../types/config.js";

export const Config: EnvConfig = {
    APPLICATION_PORT: parseInt(process.env.APPLICATION_PORT),
    REDIS: {
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: parseInt(process.env.REDIS_PORT),
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD
    },
    POSTGRES: {
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT),
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        POSTGRES_DB: process.env.POSTGRES_DB,
    },
    EMAIL: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseInt(process.env.SMTP_PORT),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM
    },
    JWT_SECRET: process.env.JWT_SECRET
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
