export interface EnvConfig {
    APPLICATION_PORT: number
    REDIS: {
        REDIS_HOST: string
        REDIS_PORT: number
        REDIS_USERNAME: string
        REDIS_PASSWORD: string
    }
    POSTGRES: {
        POSTGRES_HOST: string
        POSTGRES_PORT: number
        POSTGRES_USER: string
        POSTGRES_PASSWORD: string
        POSTGRES_DB: string
    }
    EMAIL: {
        SMTP_HOST: string
        SMTP_PORT: number
        SMTP_USER: string
        SMTP_PASSWORD: string
        EMAIL_FROM: string
    }
    JWT_SECRET: string
}