const winston = require("winston");

/**
 * Logger uses winston to format and log events.
 * Displays event in the console and stores in a file.
 */
class Logger{
    /**
     * Constructor for the logger
     * Creates and assigns clor codings for different severities and 
     */
    constructor(){
        this.levels = {error:0, warn:1,info:2, http:3};
        this.colors = {error: "red", warn: "yellow", info: "green", http:"magenta"}
        winston.addColors(this.colors)
        this.logger = winston.createLogger({
            level: "http",
            levels: this.levels,
            transports: this.defineTransport(),
        })
    }

    /**
     * Creates a format with color highlight for the different errors
     * @returns winston.format
     */
    colorizedFormat() {
        return winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        );
      }
    
    /** Returns a plain format (no colors) for file logging in txt format
     * Creates a format with color highlight for the different errors
     * @returns winston.format
     */
    plainFormat() {
        return winston.format.combine(
          winston.format.uncolorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        );
    }

    /**
     * Defines the transports used for the logger
     * @returns a list of transport for the logger
     */
    defineTransport(){
        return ([
            new winston.transports.Console({
                format: this.colorizedFormat()
            }),
            new winston.transports.File({
                filename: "/back-end/logs/error.log",
                level:"error",
                format: this.plainFormat(),
            }),
            new winston.transports.File({
                filename: "/back-end/logs/all",
                format: this.plainFormat(),
            })
        ]);
    }

    /**
     * Public interface for logging messages
     * @param {string} level - The level of the message [error, warn, info, http] 
     * @param {string} message - The message to log
     */
    log(level, message) {
        this.logger.log(level, message);
    }
}
module.exports = Logger;