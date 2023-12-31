import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import db from "../db.js";

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, json } = format;

// create a custom format for logging
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

class MySQLTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.name = "mysql";
    this.db = db;
  }

  log(info) {
    const { timestamp, level, message } = info;
    const sql =
      "INSERT INTO log_entries (timestamp, level, message) VALUES (?, ?, ?)";
    this.db.execute(sql, [timestamp, level, message]);
  }
}

// Create a transport for daily log rotation
const dailyRotateTransport = new DailyRotateFile({
  filename: "logs/api-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m", // Max file size before rotation
  maxFiles: "7d", // Keep logs for 7 days
});

// create logger
const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: "api-request.log" }),
    new MySQLTransport(),
    dailyRotateTransport,
  ],
});

export default logger;
