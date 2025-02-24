class ErrorHandler {
    /**
     * Handles Express errors and sends structured JSON responses.
     * @param {Error} err - The error object.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {Function} next - The Express next function.
     */
    static handleError(err, req, res, next) {
        // Real Logger should handle this
        console.error(`[ERROR]: ${err.message}.`);

        const status = err.status || 500;
        const message = err.userMessage || "An unexpected error occurred. Please try again later.";

        res.status(status).json({
            success: false,
            error: message
        });
    }
}

module.exports = ErrorHandler;
