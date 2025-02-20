/**
 * Factory class that creates error with custom status codes and message
 */
class ErrorCreator extends Error {
    constructor(message, status, error = null, userMessage) {
        super(message);
        this.status = status;
        this.originalError = error;
        this.userMessage = userMessage;
    }

    /**
     * Used when user input is invalid (e.g., missing fields, incorrect format)
     * @returns {ErrorCreator} - 400 Bad Request
     */
    static createValidationError(message = "Invalid input", error = null, userMessage = "There was an issue. Please check your information.") {
        return new ErrorCreator(message, 400, error, userMessage);
    }

    /**
     * Used when the request is valid but cannot be processed (e.g., duplicate registration)
     * @returns {ErrorCreator} - 400 Bad Request
     */
    static createBadRequestError(message = "Bad request", error = null, userMessage = "This information already exists in our system.") {
        return new ErrorCreator(message, 400, error, userMessage);
    }

    /**
     * Used when a requested resource is not found
     * @returns {ErrorCreator} - 404 Not Found
     */
    static createNotFoundError(message = "Resource not found", error = null, userMessage = "The requested resource was not found.") {
        return new ErrorCreator(message, 404, error, userMessage);
    }

    /**
     * Used for unexpected backend or database failures
     * @returns {ErrorCreator} - 500 Internal Server Error
     */
    static createInternalServerError(message = "Operation failed", error = null) {
        return new ErrorCreator(message, 500, error, "A system error occurred. Please try again later.");
    }

    /**
     * Used for authprization failures (unauthorized access)
     * @returns {ErrorCreator} - 401 Unauthorized
     */
    static createUnauthorizedError(message = "Unauthorized access", error = null, userMessage = "You are not authorized to perform this action.") {
        return new ErrorCreator(message, 401, error, userMessage);
    }
    /**
     * Used for authentication failures
     * @returns {ErrorCreator} - 401 Unauthorized
     */
    static createAuthenticationError(message = "Authentication error", error = null, userMessage = "There was an issue, login again.") {
        return new ErrorCreator(message, 401, error, userMessage);
    }
}

module.exports = ErrorCreator;
