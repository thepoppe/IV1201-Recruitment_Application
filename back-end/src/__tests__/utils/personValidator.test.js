const { validateCreateAccount, validateLogin, validateGetUser } = require("../../utils/personValidator");
const GenericAppError = require("../../utils/genericAppError");

describe("PersonValidator", () => {
    let req, res, next;

    beforeEach(() => {
        res = {};
        next = jest.fn();
    });

    describe("validateCreateAccount", () => {
        test("should pass validation for valid input", () => {
            req = {
                body: {
                    name: "John",
                    surname: "Doe",
                    pnr: "19900101-1234",
                    email: "john.doe@example.com",
                    password: "Password1"
                }
            };

            validateCreateAccount(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        test("should fail validation for invalid input", () => {
            const invalidInputs = [
                { surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "Password1" },
                { name: "aa", pnr: "11112233-1234", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test.se" },
                { name: "a", surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "b", pnr: "11112233-1234", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-12341", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-123", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-123a", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "111122331234", email: "test@test.se", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "hej", password: "Password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "Pass" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "Password" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "password1" },
                { name: "aa", surname: "bb", pnr: "11112233-1234", email: "test@test.se", password: "PASSWORD1" },
            ];

            invalidInputs.forEach(input => {
                req = { body: input };
                validateCreateAccount(req, res, next);
                expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
            });
        });
    });

    describe("validateLogin", () => {
        test("should pass validation for valid input", () => {
            req = {
                body: {
                    email: "john.doe@example.com",
                    password: "Password1"
                }
            };

            validateLogin(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        test("should fail validation for invalid input", () => {
            const invalidInputs = [
                { email: "john.doe@example", password: "Password1" },
                { email: "john.doe@example.com", password: "" },
            ];

            invalidInputs.forEach(input => {
                req = { body: input };
                validateLogin(req, res, next);
                expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
            });
        });
    });

    describe("validateGetUser", () => {
        test("should pass validation for valid input", () => {
            req = {
                params: {
                    id: 1
                }
            };

            validateGetUser(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        test("should fail validation for invalid input", () => {
            req = {
                params: {
                    id: "abc"
                }
            };

            validateGetUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
        });
    });
});