/**
 * Generic Error class for errors within the app
 * Uses a variation of factory pattern to create the error 
 * with custom status codes and messages
 */
class GenericAppError extends Error {
    constructor(message, status, error = null, userMessage) {
        super(message);
        this.status = status;
        this.error = error;
        this.userMessage = userMessage;
    }

    /**
     * Used when user input is invalid (e.g., missing fields, incorrect format)
     * @returns {GenericAppError} - 400 Bad Request
     */
    static createValidationError(message = "Invalid input", error = null, userMessage = "There was an issue. Please check your information.") {
        return new GenericAppError(message, 400, error, userMessage);
    }

    /**
     * Used when the request is valid but cannot be processed (e.g., duplicate registration)
     * @returns {GenericAppError} - 400 Bad Request
     */
    static createBadRequestError(message = "Bad request", error = null, userMessage = "This information already exists in our system.") {
        return new GenericAppError(message, 400, error, userMessage);
    }

    /**
     * Used when a requested resource is not found
     * @returns {GenericAppError} - 404 Not Found
     */
    static createNotFoundError(message = "Resource not found", error = null, userMessage = "The requested resource was not found.") {
        return new GenericAppError(message, 404, error, userMessage);
    }

    /**
     * Used for unexpected backend or database failures
     * @returns {GenericAppError} - 500 Internal Server Error
     */
    static createInternalServerError(message = "Operation failed", error = null) {
        return new GenericAppError(message, 500, error, "A system error occurred. Please try again later.");
    }

    /**
     * Used for authprization failures (unauthorized access)
     * @returns {GenericAppError} - 401 Unauthorized
     */
    static createUnauthorizedError(message = "Unauthorized access", error = null, userMessage = "You are not authorized to perform this action.") {
        return new GenericAppError(message, 401, error, userMessage);
    }
    /**
     * Used for authentication failures
     * @returns {GenericAppError} - 401 Unauthorized
     */
    static createAuthenticationError(message = "Authentication error", error = null, userMessage = "There was an issue, login again.") {
        return new GenericAppError(message, 401, error, userMessage);
    }
}

module.exports = GenericAppError;
