import winston from 'winston';
import db from './db.js';

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, json } = format;

// create a custom format for logging
const logFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

class MySQLTransport extends winston.Transport {
    constructor(options) {
      super(options);
      this.name = 'mysql';
      this.db = db;
    }
  
    log(info) {
        const { timestamp, level, message } = info; 
        const sql = 'INSERT INTO log_entries (timestamp, level, message) VALUES (?, ?, ?)';
        this.db.execute(sql, [timestamp, level, message]);
    }
}

// create logger
const logger = createLogger({
    level: 'debug',
    format: combine(
        label({label: 'API request logging'}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        json(),
        logFormat
    ), 
    transports: [
        new transports.File({ filename: 'api-request.log'}),
        new transports.Console(),
        new MySQLTransport()
    ]
})

export default logger;