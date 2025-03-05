const express = require("express");
const request = require("supertest");
const PersonApi = require("../../api/personAPI");
const Controller = require("../../controller/controller");
const PersonDTO = require("../../models/personDTO");
const GenericAppError = require("../../utils/genericAppError");
const AuthHandler = require("../../api/auth/authorization");
const ErrorHandler = require("../../api/errorHandler/errorHandler");
const PersonValidator = require("../../utils/personValidator");
const Logger = require("../../utils/logger");



jest.mock("../../controller/controller");
jest.mock("../../api/auth/authorization");
jest.mock("../../utils/personValidator");
jest.mock("../../utils/logger");

/**
 * Had to manually mock the AuthHandler for the test to work
 */
AuthHandler.mockImplementation(() => ({
    generateToken: jest.fn(() => "dummy-token"),
    verifyToken: jest.fn(() => ({ id: 1, email: "john.doe@example.com" })),
    authenticateUser: jest.fn((req, res, next) => {
        req.decoded = { id: 1, email: "john.doe@example.com" };
        next();
    }),
    authorizePersonRequest: jest.fn(() => (req, res, next) => {
        next();
    }),
    extractUserData: jest.fn((person) => ({ id: person.id, email: person.email })),
    addTokenToResponse: jest.fn((person) => ({ token: "dummy-token", person }))
}));

Logger.mockImplementation(() => {
    log: jest.fn()
});


describe("PersonApi", () => {
    let app;
    let personApi;
    let controllerMock;
    let authMock;
    let errorHandler;
    let logger;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        logger = new Logger();
        errorHandler = new ErrorHandler(logger);
        controllerMock = new Controller(logger);
        authMock = new AuthHandler();
        personApi = new PersonApi(logger);
        personApi.controller = controllerMock;
        personApi.auth = authMock;
        personApi.registerRoutes();
        app.use("/api/person", personApi.router);
        app.use(errorHandler.handleError);
    });

    beforeEach(() => {
        PersonValidator.validateLogin.mockImplementation((req, res, next) => next());
        PersonValidator.validateCreateAccount.mockImplementation((req, res, next) => next());
        PersonValidator.validateGetUser.mockImplementation((req, res, next) => next());
        controllerMock.getPersonData.mockReset();
        controllerMock.login.mockReset();
        controllerMock.createPerson.mockReset();
        authMock.authenticateUser.mockImplementation(((req, res, next) => {
            req.decoded = { id: 1, email: "john.doe@example.com" };
            next();
        }))
    });
    

    afterAll(() => {
        app = null;
        personApi = null;
    });

    describe("POST /create-account", () => {
        const newPerson = { 
            name: "John", 
            surname: "Doe", 
            pnr: "19900101-1234", 
            email: "john.doe@example.com", 
            password: "Password1" 
        };
        test("Valid request, should create a new person", async () => {
            const personDTO = new PersonDTO(newPerson);
            controllerMock.createPerson.mockResolvedValue(personDTO);
            
            const response = await request(app)
            .post("/api/person/create-account")
            .send(newPerson)
            .expect(201);

            expect(response.body).toEqual({ success: true, data: personDTO });
            expect(controllerMock.createPerson).toHaveBeenCalledWith(newPerson);
        });

        test("Validation error, should return 400 if invalid data is sent", async () => {
            PersonValidator.validateCreateAccount.mockImplementation((req, res, next) => next(GenericAppError.createValidationError()));
            await request(app)
                .post("/api/person/create-account")
                .send(newPerson)
                .expect(400);
        });

        test("Unique error, should return 400 if email or pnr is not unique", async () => {
            controllerMock.createPerson.mockRejectedValue(
                GenericAppError.createBadRequestError("email already exists || pnr already exists")
            );

            await request(app)
                .post("/api/person/create-account")
                .send(newPerson)
                .expect(400);
        });

        test("General App error, should return 500 if other error has occurred", async () => {
            controllerMock.createPerson.mockRejectedValue(GenericAppError.createInternalServerError());

            await request(app)
                .post("/api/person/create-account")
                .send(newPerson)
                .expect(500);
            });
        });
        describe("POST /login", () => {
            const loginData = { email: "john.doe@example.com", password: "Password1" };
            
            
            test("Valid Request, should login a person", async () => {
                const person = { id: 1, email: "john.doe@example.com" };
            const tokenResponse = { token: "token", person };
            controllerMock.login.mockResolvedValue(person);
            authMock.addTokenToResponse.mockReturnValue(tokenResponse);


            const response = await request(app)
                .post("/api/person/login")
                .send(loginData)
                .expect(200);

            expect(response.body).toEqual({ success: true, data: tokenResponse });
            expect(controllerMock.login).toHaveBeenCalledWith(loginData);
        });
        test("Authentication error, should return 401 if user email does not exist", async () => {
            controllerMock.login.mockRejectedValue(GenericAppError.createAuthenticationError());
            
            const response = await request(app)
            .post("/api/person/login")
            .send(loginData)
            .expect(401);
            
            expect(response.body).toEqual({ success: false, error: expect.any(String) });
            expect(controllerMock.login).toHaveBeenCalledWith(loginData);
            });
            
            test("Validation error, should return 400 if bad input", async () => {
                PersonValidator.validateLogin.mockImplementation((req, res, next) => next(GenericAppError.createValidationError()));
                
                const response = await request(app)
                .post("/api/person/login")
                .send(loginData)
                .expect(400);

            expect(response.body).toEqual({ success: false, error: expect.any(String) });
            expect(controllerMock.login).not.toHaveBeenCalledWith(loginData);
            });
            test("General App error, should return 500 if addTokenToResponse fails", async () => {
                authMock.addTokenToResponse.mockImplementation(() => { throw GenericAppError.createInternalServerError(); });
        
                const response = await request(app)
                .post("/api/person/login")
                .send(loginData);
        
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, error: expect.any(String) });
            expect(controllerMock.login).toHaveBeenCalledWith(loginData);
        });
    });

    
    describe("GET /me", () => {
        const person = { 
            id: 1, 
            name: "John", 
            surname: "Doe", 
            pnr: "19900101-1234", 
            email: "john.doe@example.com", 
            password: "Password1" 
        };

        test("Valid Authentication, should get authenticated person data", async () => {
            controllerMock.getPersonData.mockResolvedValue(new PersonDTO(person));

            const response = await request(app)
                .get("/api/person/me")
                .set("Authorization", "Bearer dummy-token")
                .expect(200);

            expect(response.body).toEqual({ success: true, data: new PersonDTO(person) });
            expect(controllerMock.getPersonData).toHaveBeenCalledWith(person.id);
        });
        test("Invalid Authentication, should get 401 error", async () => {
            controllerMock.getPersonData.mockResolvedValue(new PersonDTO(person));
            authMock.authenticateUser.mockImplementation((req, res, next) => {
                return next(GenericAppError.createAuthenticationError());
            });

            const response = await request(app)
                .get("/api/person/me")
                .set("Authorization", "Bearer dummy-token")
                .expect(401);
            expect(controllerMock.getPersonData).not.toHaveBeenCalledWith(person.id);
        });
    });
    
    describe("GET /id/:id", () => {
        const person = { id: 1, name: "John", surname: "Doe", email: "john.doe@example.com" };

        test("Valid request, should get authenticated person data", async () => {
            controllerMock.getPersonData.mockResolvedValue(person);
    
            const response = await request(app)
                .get(`/api/person/id/${person.id}`)
                .expect(200);
    
            expect(response.body).toEqual({ success: true, data: person });
            expect(controllerMock.getPersonData).toHaveBeenCalled();
        });

        test("Authentication error, should return 401 if user is not authenticated", async () => {
            authMock.authenticateUser.mockImplementation((req, res, next) => {next(GenericAppError.createAuthenticationError())});
            const response = await request(app)
                .get(`/api/person/id/${person.id}`)
                .expect(401);
            expect(controllerMock.getPersonData).not.toHaveBeenCalled();
        });

        test("Validation error, should return 400 if input fails validation", async () => {
            PersonValidator.validateGetUser.mockImplementation((req, res, next) => {next(GenericAppError.createValidationError())});
            authMock.authenticateUser.mockImplementation((req, res, next) => {next()});
            const response = await request(app)
                .get(`/api/person/id/${person.id}`)
                .expect(400);
            expect(controllerMock.getPersonData).not.toHaveBeenCalled();
        });

        test("General App error, should return 500 if other error has occurred", async () => {
            authMock.authenticateUser.mockImplementation((req, res, next) => {next()});
            controllerMock.getPersonData.mockRejectedValue(GenericAppError.createInternalServerError());
            const response = await request(app)
                .get(`/api/person/id/${person.id}`)
                .expect(500);
            expect(controllerMock.getPersonData).toHaveBeenCalled();
        });

        test("Invalid Authorization, should return 401 if auth throws error before controller throws 500", async () => {
            /**
             * Separate PersonAPI route since the Authorize Person Request middleware needs to be bound to the controller
            */
            const tempApp = express();
            tempApp.use(express.json());
            const tempControllerMock = new Controller(logger);
            const tempAuthMock = new AuthHandler();
            const tempPersonApi = new PersonApi(logger);
            tempAuthMock.authenticateUser.mockImplementation((req, res, next) => {next()});
            tempAuthMock.authorizePersonRequest.mockImplementation((controller) => {
                return (req, res, next) => next(GenericAppError.createUnauthorizedError());
            });
            tempControllerMock.getPersonData.mockRejectedValue(GenericAppError.createInternalServerError());
            tempPersonApi.controller = tempControllerMock;
            tempPersonApi.auth = tempAuthMock;
            tempPersonApi.registerRoutes();
            tempApp.use("/api/person", tempPersonApi.router);
            tempApp.use(errorHandler.handleError);

            const response = await request(tempApp)
                .get(`/api/person/id/${person.id}`)
                .expect(401);
            expect(response.status).not.toBe(500);
            expect(tempControllerMock.getPersonData).not.toHaveBeenCalled();
        });
    });

}); 
