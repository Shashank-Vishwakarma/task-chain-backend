export interface EnvConfig {
    PORT: number
    REDIS: {
        HOST: string
        PORT: number
        USERNAME: string
        PASSWORD: string
    }
    POSTGRES: {
        HOST: string
        PORT: number
        USERNAME: string
        PASSWORD: string
        DATABASE: string
    }
}