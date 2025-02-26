const morgan = require("morgan");

class HttpLogger{
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