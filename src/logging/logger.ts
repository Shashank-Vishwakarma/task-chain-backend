import winston from "winston"

const timestampFormat = "YYYY-MM-DD hh:mm:ss"
const {colorize, timestamp, combine, printf} = winston.format

export const logger = winston.createLogger({
    format: combine(
        colorize(),
        timestamp({format: timestampFormat}),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
})
