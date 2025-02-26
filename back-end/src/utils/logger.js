const winston = require("winston");

class Logger{
    constructor(){
        this.levels = {error:0, warn:1,info:2, http:3};
        this.colors = {error: "red", warn: "yellow", info: "green", http:"magenta"}
        this.format = this.setUpErrorFormat();
        this.transports = this.defineTransport();
        this.logger = winston.createLogger({
            level: "http",
            levels: this.levels,
            format: this.format,
            transports: this.transports,
        })
    }

    setUpErrorFormat(){
        winston.addColors(this.colors);
        return(winston.format.combine(
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
            winston.format.colorize({all:true}),
            winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`))
        );
    }

    defineTransport(){
        return ([
            new winston.transports.Console(),
            new winston.transports.File({
                filename: "/back-end/logs/error.log",
                level:"error",
            }),
            new winston.transports.File({
                filename: "/back-end/logs/all",
            })
        ]);
    }

    log(level, message) {
        this.logger.log(level, message);
    }
}
module.exports = Logger;