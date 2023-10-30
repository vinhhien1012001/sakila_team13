import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

// create a custom format for logging
const logFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

// create logger
const logger = createLogger({
    level: 'info',
    format: combine(
        label({label: 'API request logging'}),
        timestamp(),
        logFormat
    ), 
    transports: [
        new transports.File({ filename: 'api-request.log'}),
    ]
})

export default logger;