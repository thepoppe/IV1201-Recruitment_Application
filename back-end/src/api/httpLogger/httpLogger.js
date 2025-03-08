const morgan = require("morgan");

/**
 * HttpLogger is a middleware class using morgan to intercept and log incoming http requests
 */
class HttpLogger{

    /**
     * Constructor for HttpLogger
     * @param {Logger} logger - The logger instance used for logging 
     */
    constructor(logger){
        this.logger = logger;
        this.stream = {write: (msg) => {
            this.logger.log("http", msg);
        }};
        this.logHttpRequest = morgan(
            ":remote-addr :method :url :status :res[content-length] - :response-time ms",
            { stream: this.stream}
        );
    };
}
module.exports = HttpLogger;