const Auth = require("../../../api/auth/authorization");
const GenericAppError = require("../../../utils/genericAppError");
const Controller = require("../../../controller/controller");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jest.mock("../../../controller/controller");


const valid = {
    id: 1,
    name: "aa",
    surname: "bb",
    pnr: "11112233-1234",
    email: "test@test.se",
    password: "Password1"
  };

describe("Auth", () => {
    let auth;

    beforeAll(() => {
        auth = new Auth();
    });

    afterAll(() => {
        auth = null;
    });

    describe("addTokenToResponse", () => {
        test("should add token to response", () => {
            jwt.sign.mockReturnValue("token");
            const result = auth.addTokenToResponse(valid);
            expect(result).toEqual({ token: "token", person: valid });
        });

        test("should throw an error if token generation fails", async () => {
            jwt.sign.mockImplementation(() => { throw new Error("Token generation failed"); });
            expect(() => auth.addTokenToResponse(valid)).toThrow(GenericAppError);

          });
    });

    describe("authenticateUser", () => {
        let req, res, next;
        res = {};
        next = jest.fn();
        beforeEach(() => {
            req = {};
        });
    
        test("should authenticate user", async () => {
            req = { headers: { authorization: "Bearer token" } };
            jwt.verify.mockReturnValue(valid);
            await auth.authenticateUser(req, res, next);
            expect(req.decoded).toEqual(valid);
            expect(next).not.toHaveBeenCalledWith(expect.any(Error));
        });
    
        test("should call next with an error 401 since no header", async () => {
            req = { headers: {} };
            jwt.verify.mockReturnValue(valid);
            await auth.authenticateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
        });
    
        test("should call next with an error 401 since invalid header", async () => {
            req = { headers: { authorization: "Bearertoken" } };
            jwt.verify.mockReturnValue(valid);
            await auth.authenticateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
        });
    
        test("should call next with an error 401 since token is expired", async () => {
            req = { headers: { authorization: "Bearer token" } };
            jwt.verify.mockImplementation(() => { throw new jwt.TokenExpiredError("Token Expired"); });
            await auth.authenticateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
        });
    
        test("should call next with a 500 error when verifyToken throws a generic error", async () => {
            req = { headers: { authorization: "Bearer token" } };
            auth.verifyToken = jest.fn(() => { throw new Error("Generic verification error"); });
            await auth.authenticateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
        });
    });
    
    describe("authorizeRecruiter", () => {
        let req, res, next, controller;
        beforeEach(() => {
            req = {};
            res = {};
            next = jest.fn();
            controller = new Controller();
        });
    
        test("should authorize the person request and call next without an error", async () => {
            req = { params: { id: 1 }, decoded: { id: 2 } };
            controller.getUserRole.mockReturnValue("recruiter");
            await auth.authorizeRecruiter(controller)(req, res, next);
            expect(next).not.toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
        });
    
        test("should not authorize the person request and call next with a 403 error", async () => {
            req = { params: { id: 1 }, decoded: { id: 2 } };
            controller.getUserRole.mockReturnValue("applicant");
            await auth.authorizeRecruiter(controller)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
        });
    
        test("should not authorize the person request and call next with a 500 error when getUserRole returns an error", async () => {
            req = { params: { id: 1 }, decoded: { id: 2 } };
            controller.getUserRole.mockRejectedValue(new Error("role error"));
            await auth.authorizeRecruiter(controller)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
        });
    });
    
});