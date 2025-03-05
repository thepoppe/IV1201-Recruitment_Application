const ErrorHandler = require("../../../api/errorHandler/errorHandler");
const GenericAppError = require("../../../utils/genericAppError");
const LoggerMock = require("../../../utils/logger")

jest.mock("../../../utils/logger");
LoggerMock.mockImplementation(() => {
    log: jest.fn()
});

describe("ErrorHandler", () => {
    let req, res, next;
    const errorHandler = new ErrorHandler(new LoggerMock())

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

        errorHandler.handleError(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "A system error occurred. Please try again later."
        });
    });

    test("should handle error with custom status and message", () => {
        const error = GenericAppError.createBadRequestError("Console message", null,"Custom error message");

        errorHandler.handleError(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Custom error message"
        });
    });
});