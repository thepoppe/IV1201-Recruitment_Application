const GenericAppError = require("../../utils/genericAppError");

/**
 * ErrodHandler is a middleware class that is called when the application throws an error.
 */
class ErrorHandler {

    /**
     * Constructor for ErrorHandler
     * @param {Logger} logger - the logger instance 
     */
    constructor(logger){
        this.logger = logger;
        this.handleError = this.handleError.bind(this);
    }
    /**
     * Handles Express errors and sends structured JSON responses.
     * @param {GenericAppError} err - The error object.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {Function} next - The Express next function.
     */
    handleError(err, req, res, next) {
        this.logError(err);
        const status = err.status || 500;
        const message = err.userMessage || "An unexpected error occurred. Please try again later.";

        res.status(status).json({
            success: false,
            error: message
        });
    }

    /**
     * Helper function to log thrown errors
     * Errors causing status 500 logs an error event with full stacktrace
     * Business logic errors logs a warning
     * @param {GenericAppError} err - The thrown Error
     */
    logError(err){
        const originalError = err.error;
        if (err.status == 500){
            const errorMessage = originalError?  `${err.message}\ncause: ${originalError.stack}` : `${err.message}`;
            this.logger.log("error", errorMessage);
        }
        else{
            const errorMessage = originalError?  `${err.message}\ncause: ${originalError.constructor.name} ${originalError.message}` : `${err.message}`;
            this.logger.log("warn", errorMessage);
        }
    }
}

module.exports = ErrorHandler;
