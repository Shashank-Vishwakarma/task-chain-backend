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
        POSTGRES_DATABASE: string
    }
}