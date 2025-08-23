// config/logger.ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // default logging level
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // errors
    new transports.File({ filename: "logs/combined.log" }) // everything
  ],
});

export default logger;
