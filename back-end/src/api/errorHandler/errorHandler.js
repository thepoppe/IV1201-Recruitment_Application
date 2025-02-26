class ErrorHandler {

    constructor(logger){
        this.logger = logger;
        this.handleError = this.handleError.bind(this);
    }
    /**
     * Handles Express errors and sends structured JSON responses.
     * @param {Error} err - The error object.
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
     * Helper function to log error
     */
    logError(err){
        const originalError = err.error;
        const errorMessage = originalError?  `${err.message}\ncause: ${originalError.constructor.name} ${originalError.message}` : `${err.message}`;
        this.logger.log("error", errorMessage);
    }
}

module.exports = ErrorHandler;
