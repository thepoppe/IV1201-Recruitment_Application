const GenericAppError = require("../../utils/genericAppError");

describe("GenericAppError", () => {
    test("should create a validation error", () => {
        const error = GenericAppError.createValidationError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Invalid input");
        expect(error.status).toBe(400);
        expect(error.userMessage).toBe("There was an issue. Please check your information.");
    });

    test("should create a bad request error", () => {
        const error = GenericAppError.createBadRequestError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Bad request");
        expect(error.status).toBe(400);
        expect(error.userMessage).toBe("This information already exists in our system.");
    });

    test("should create a not found error", () => {
        const error = GenericAppError.createNotFoundError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Resource not found");
        expect(error.status).toBe(404);
        expect(error.userMessage).toBe("The requested resource was not found.");
    });

    test("should create an internal server error", () => {
        const error = GenericAppError.createInternalServerError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Operation failed");
        expect(error.status).toBe(500);
        expect(error.userMessage).toBe("A system error occurred. Please try again later.");
    });

    test("should create an unauthorized error", () => {
        const error = GenericAppError.createUnauthorizedError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Unauthorized access");
        expect(error.status).toBe(401);
        expect(error.userMessage).toBe("You are not authorized to perform this action.");
    });

    test("should create an authentication error", () => {
        const error = GenericAppError.createAuthenticationError();
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Authentication error");
        expect(error.status).toBe(401);
        expect(error.userMessage).toBe("There was an issue, login again.");
    });

    test("should create an error with custom message and status", () => {
        const error = new GenericAppError("Custom error", 418, new Error("Original error"), "Custom user message");
        expect(error).toBeInstanceOf(GenericAppError);
        expect(error.message).toBe("Custom error");
        expect(error.status).toBe(418);
        expect(error.originalError).toBeInstanceOf(Error);
        expect(error.originalError.message).toBe("Original error");
        expect(error.userMessage).toBe("Custom user message");
    });
});