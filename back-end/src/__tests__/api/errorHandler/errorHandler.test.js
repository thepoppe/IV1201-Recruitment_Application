const ErrorHandler = require("../../../api/errorHandler/errorHandler");
const GenericAppError = require("../../../utils/genericAppError");

describe("ErrorHandler", () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test("should handle error with default status and message", () => {
        const error = GenericAppError.createInternalServerError("Test error");

        ErrorHandler.handleError(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "A system error occurred. Please try again later."
        });
    });

    test("should handle error with custom status and message", () => {
        const error = GenericAppError.createBadRequestError("Console message", null,"Custom error message");

        ErrorHandler.handleError(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Custom error message"
        });
    });
});