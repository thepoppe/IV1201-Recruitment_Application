const express = require("express");
const request = require("supertest");
const ApplicationAPI = require("../../api/applicationAPI");
const Controller = require("../../controller/controller");
const GenericAppError = require("../../utils/genericAppError");
const AuthHandler = require("../../api/auth/authorization");
const ErrorHandler = require("../../api/errorHandler/errorHandler");
const ApplicationValidatorMock = require("../../utils/applicationValidator");
const Logger = require("../../utils/logger");

jest.mock("../../controller/controller");
jest.mock("../../api/auth/authorization");
jest.mock("../../utils/applicationValidator");
jest.mock("../../utils/logger");

/**
 * Manually mock the AuthHandler for the test
 */
AuthHandler.mockImplementation(() => ({
    generateToken: jest.fn(() => "dummy-token"),
    verifyToken: jest.fn(() => ({ id: 1, email: "john.doe@example.com" })),
    authenticateUser: jest.fn((req, res, next) => {
        req.decoded = { id: 1, email: "john.doe@example.com" };
        next();
    }),
    authorizeRecruiter: jest.fn(() => (req, res, next) => {
        next();
    }),
    extractUserData: jest.fn((person) => ({ id: person.id, email: person.email })),
    addTokenToResponse: jest.fn((person) => ({ token: "dummy-token", person }))
}));

Logger.mockImplementation(() => ({
    log: jest.fn()
}));


const validApplication =  {
    competences: [{ competence_id: 1, years_of_experience: 5 }],
    availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }]
}
const validApplicationRes = {
    application_id:1,
    person_id:1,
    submission_date: "today",
    status: "unhandled",
}

const authenticationErrorMsg = GenericAppError.createAuthenticationError().userMessage;
const validationErrorMsg = GenericAppError.createValidationError().userMessage;
const internalErrorMsg = GenericAppError.createInternalServerError().userMessage;
const unexpectedErrorMsg = "An unexpected error occurred. Please try again later.";

describe("applicationApi", () => {
    let app;
    let applicationApi;
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
        applicationApi = new ApplicationAPI(logger);
        applicationApi.controller = controllerMock;
        applicationApi.auth = authMock;
        applicationApi.registerRoutes();
        app.use("/api/application", applicationApi.router);
        app.use(errorHandler.handleError);
    });

    beforeEach(() => {
        ApplicationValidatorMock.validateApplyForJob.mockImplementation((req, res, next) => next());
        ApplicationValidatorMock.validateUpdateStatus.mockImplementation((req, res, next) => next());
        controllerMock.applyForJob.mockReset();
        controllerMock.listAllCompetences.mockReset();
        controllerMock.getUserApplication.mockReset();
        controllerMock.getAllApplications.mockReset();
        controllerMock.getApplicationById.mockReset();
        controllerMock.updateApplicationStatus.mockReset();
        authMock.authenticateUser.mockImplementation(((req, res, next) => {
            req.decoded = { id: 1, email: "john.doe@example.com" };
            next();
        }))
    });
    

    afterAll(() => {
        app = null;
        applicationApi = null;
    });

    describe("apply", ()=> {
        test("should create an application", async ()=> {
            controllerMock.applyForJob.mockResolvedValue(validApplicationRes);
            const response = await request(app)
            .post("/api/application/apply")
            .send(validApplication)
            .expect(201)

            expect(response.body).toEqual({success: true, data: validApplicationRes})
            expect(controllerMock.applyForJob).toHaveBeenCalledWith(1,
                validApplication.competences,
                validApplication.availabilities)
        })

        test("should return 401 if authentication fails", async () => {
            authMock.authenticateUser.mockImplementation((req, res, next) => {
                next(GenericAppError.createAuthenticationError())
            });

            const response = await request(app)
            .post("/api/application/apply")
            .send(validApplication)
            .expect(401);

            expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
            expect(controllerMock.applyForJob).not.toHaveBeenCalled();
        });

        test("should return 400 if validation fails", async () => {
            ApplicationValidatorMock.validateApplyForJob.mockImplementation((req, res, next) => {
            next(GenericAppError.createValidationError());
            });

            const response = await request(app)
            .post("/api/application/apply")
            .send(validApplication)
            .expect(400);

            expect(response.body).toEqual({ success: false, error: validationErrorMsg });
            expect(controllerMock.applyForJob).not.toHaveBeenCalled();
        });

        test("should return 500 if controller throws a GenericAppError", async () => {
            controllerMock.applyForJob.mockRejectedValue(GenericAppError.createInternalServerError());

            const response = await request(app)
            .post("/api/application/apply")
            .send(validApplication)
            .expect(500);

            expect(response.body).toEqual({ success: false, error: internalErrorMsg });
            expect(controllerMock.applyForJob).toHaveBeenCalledWith(1,
            validApplication.competences,
            validApplication.availabilities);
        });

        test("should return 500 if controller throws an error", async () => {
            controllerMock.applyForJob.mockRejectedValue(new Error());

            const response = await request(app)
            .post("/api/application/apply")
            .send(validApplication)
            .expect(500);

            expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
            expect(controllerMock.applyForJob).toHaveBeenCalledWith(1,
            validApplication.competences,
            validApplication.availabilities);
        });
    });

        
    describe("listAllCompetences", () => {
        test("should list all competences", async () => {
            const competences = [{ id: 1, name: "Competence 1" }, { id: 2, name: "Competence 2" }];
            controllerMock.listAllCompetences.mockResolvedValue(competences);

            const response = await request(app)
                .get("/api/application/competences")
                .expect(200);

            expect(response.body).toEqual({ success: true, data: competences });
            expect(controllerMock.listAllCompetences).toHaveBeenCalled();
        });

        test("should return 401 if authentication fails", async () => {
            authMock.authenticateUser.mockImplementation((req, res, next) => {
                next(GenericAppError.createAuthenticationError())
            });
            const response = await request(app)
                .get("/api/application/competences")
                .expect(401);

            expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
            expect(controllerMock.listAllCompetences).not.toHaveBeenCalled();
        });

        test("should return 500 if controller throws a GenericAppError", async () => {
            controllerMock.listAllCompetences.mockRejectedValue(GenericAppError.createInternalServerError());

            const response = await request(app)
                .get("/api/application/competences")
                .expect(500);

            expect(response.body).toEqual({ success: false, error: internalErrorMsg });
            expect(controllerMock.listAllCompetences).toHaveBeenCalled();
        });

        test("should return 500 if controller throws an error", async () => {
            controllerMock.listAllCompetences.mockRejectedValue(new Error());

            const response = await request(app)
                .get("/api/application/competences")
                .expect(500);

            expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
            expect(controllerMock.listAllCompetences).toHaveBeenCalled();
        });
    })

    describe("getUserApplication", () => {
        test("should get the current user's application", async () => {
            const application = { id: 1, competences: [], availabilities: [] };
            controllerMock.getUserApplication.mockResolvedValue(application);

            const response = await request(app)
                .get("/api/application/my-application")
                .expect(200);

            expect(response.body).toEqual({ success: true, data: application });
            expect(controllerMock.getUserApplication).toHaveBeenCalledWith(1);
        });

        test("should return 401 if authentication fails", async () => {
            authMock.authenticateUser.mockImplementation((req, res, next) => {
                next(GenericAppError.createAuthenticationError())
            });

            const response = await request(app)
                .get("/api/application/my-application")
                .expect(401);

            expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
            expect(controllerMock.getUserApplication).not.toHaveBeenCalled();
        });

        test("should return 500 if controller throws a GenericAppError", async () => {
            controllerMock.getUserApplication.mockRejectedValue(GenericAppError.createInternalServerError());

            const response = await request(app)
                .get("/api/application/my-application")
                .expect(500);

            expect(response.body).toEqual({ success: false, error: internalErrorMsg });
            expect(controllerMock.getUserApplication).toHaveBeenCalledWith(1);
        });

        test("should return 500 if controller throws an error", async () => {
            controllerMock.getUserApplication.mockRejectedValue(new Error());

            const response = await request(app)
                .get("/api/application/my-application")
                .expect(500);

            expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
            expect(controllerMock.getUserApplication).toHaveBeenCalledWith(1);
        });
    });

    /**
     * Authorization for applicant and recruiter splitted since authorizeRecruiter needs to be bound with controller
     */
    describe("Admin requests, as an authorized as a recruiter", ()=>{
        describe("getAllApplications", () => {
            test("should fetch all applications", async () => {
                const applications = [
                { id: 1, competences: [], availabilities: [] },
                { id: 2, competences: [], availabilities: [] }
            ];
            controllerMock.getAllApplications.mockResolvedValue(applications);

            const response = await request(app)
                .get("/api/application/all")
                .expect(200);

            expect(response.body).toEqual({ success: true, data: applications });
            expect(controllerMock.getAllApplications).toHaveBeenCalled();
            });

            test("should return 401 if authentication fails", async () => {
                authMock.authenticateUser.mockImplementation((req, res, next) => {
                    next(GenericAppError.createAuthenticationError())
                });

                const response = await request(app)
                    .get("/api/application/all")
                    .expect(401);

                expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
                expect(controllerMock.getAllApplications).not.toHaveBeenCalled();
            });


            test("should return 500 if controller throws a GenericAppError", async () => {
                controllerMock.getAllApplications.mockRejectedValue(GenericAppError.createInternalServerError());

                const response = await request(app)
                    .get("/api/application/all")
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: internalErrorMsg });
                expect(controllerMock.getAllApplications).toHaveBeenCalled();
            });

            test("should return 500 if controller throws an error", async () => {
                controllerMock.getAllApplications.mockRejectedValue(new Error());

                const response = await request(app)
                    .get("/api/application/all")
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
                expect(controllerMock.getAllApplications).toHaveBeenCalled();
            });
        });

        describe("getApplicationById", () => {
            test("should fetch an application by ID", async () => {
                const application = { id: 1, competences: [], availabilities: [] };
                controllerMock.getApplicationById.mockResolvedValue(application);

                const response = await request(app)
                    .get("/api/application/1")
                    .expect(200);

                expect(response.body).toEqual({ success: true, data: application });
                expect(controllerMock.getApplicationById).toHaveBeenCalledWith("1");
            });

            test("should return 401 if authentication fails", async () => {
                authMock.authenticateUser.mockImplementation((req, res, next) => {
                    next(GenericAppError.createAuthenticationError())
                });

                const response = await request(app)
                    .get("/api/application/1")
                    .expect(401);

                expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
                expect(controllerMock.getApplicationById).not.toHaveBeenCalled();
            });

            test("should return 500 if controller throws a GenericAppError", async () => {
                controllerMock.getApplicationById.mockRejectedValue(GenericAppError.createInternalServerError());

                const response = await request(app)
                    .get("/api/application/1")
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: internalErrorMsg });
                expect(controllerMock.getApplicationById).toHaveBeenCalledWith("1");
            });

            test("should return 500 if controller throws an error", async () => {
                controllerMock.getApplicationById.mockRejectedValue(new Error());

                const response = await request(app)
                    .get("/api/application/1")
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
                expect(controllerMock.getApplicationById).toHaveBeenCalledWith("1");
            });
        });

        describe("updateApplicationStatus", () => {
            test("should update application status", async () => {
                const updatedApplication = { id: 1, status: "accepted" };
                controllerMock.updateApplicationStatus.mockResolvedValue(updatedApplication);

                const response = await request(app)
                    .patch("/api/application/1/status")
                    .send({ status: "accepted" })
                    .expect(200);

                expect(response.body).toEqual({ success: true, data: updatedApplication });
                expect(controllerMock.updateApplicationStatus).toHaveBeenCalledWith("1", "accepted");
            });
            test("should update application status", async () => {
                const badStatus= "invalid status"
                ApplicationValidatorMock.validateUpdateStatus.mockImplementation((req, res, next) => {
                    next(GenericAppError.createValidationError());
                });

                const response = await request(app)
                    .patch("/api/application/1/status")
                    .send({ status: badStatus })
                    .expect(400);
            });

            test("should return 401 if authentication fails", async () => {
                authMock.authenticateUser.mockImplementation((req, res, next) => {
                    next(GenericAppError.createAuthenticationError())
                });

                const response = await request(app)
                    .patch("/api/application/1/status")
                    .send({ status: "accepted" })
                    .expect(401);

                expect(response.body).toEqual({ success: false, error: authenticationErrorMsg });
                expect(controllerMock.updateApplicationStatus).not.toHaveBeenCalled();
            });

            test("should return 500 if controller throws a GenericAppError", async () => {
                controllerMock.updateApplicationStatus.mockRejectedValue(GenericAppError.createInternalServerError());

                const response = await request(app)
                    .patch("/api/application/1/status")
                    .send({ status: "accepted" })
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: internalErrorMsg });
                expect(controllerMock.updateApplicationStatus).toHaveBeenCalledWith("1", "accepted");
            });

            test("should return 500 if controller throws an error", async () => {
                controllerMock.updateApplicationStatus.mockRejectedValue(new Error());

                const response = await request(app)
                    .patch("/api/application/1/status")
                    .send({ status: "accepted" })
                    .expect(500);

                expect(response.body).toEqual({ success: false, error: unexpectedErrorMsg });
                expect(controllerMock.updateApplicationStatus).toHaveBeenCalledWith("1", "accepted");
            });
        });
    })

    /**
     * Need to split the auth mock as authorizeRecreuiter needs to be bound with controller
    */
    describe("Admin requests, as a non authorized user", () => {
        const newApp = express();
        newApp.use(express.json());
        const newLogger = new Logger()
        const newControllerMock = new Controller(newLogger);
        const newAuthMock = new AuthHandler();
        const newApplicationApi = new ApplicationAPI(newLogger);
        const newErrorHandler = new ErrorHandler(newLogger);
        newControllerMock.getUserRole = jest.fn().mockResolvedValue("applicant")
        newAuthMock.authenticateUser.mockImplementation(((req, res, next) => {
            req.decoded = { id: 1, email: "john.doe@example.com" };
            next();
        }))
        newAuthMock.authorizeRecruiter.mockImplementation(() => {
            return (req, res, next) => {
                const err = GenericAppError.createAuthorizationError();
                next(err);
            };
        });
        
        newControllerMock.getAllApplications.mockRejectedValue(GenericAppError.createInternalServerError())
        newControllerMock.getApplicationById.mockRejectedValue(GenericAppError.createInternalServerError())
        newControllerMock.updateApplicationStatus.mockRejectedValue(GenericAppError.createInternalServerError())
        newApplicationApi.controller = newControllerMock;
        newApplicationApi.auth = newAuthMock;
        newApplicationApi.registerRoutes();
        newApp.use("/api/application", newApplicationApi.router);
        
        newApp.use(newErrorHandler.handleError);

        const errorMsg = GenericAppError.createAuthorizationError().userMessage
       
       describe("getAllApplications", () => {
           test("should return 403 if user is not a recruiter", async () => {
                const response = await request(newApp)
                .get("/api/application/all")
                .expect(403);
                    
                expect(response.body).toEqual({ success: false, error:errorMsg });
                expect(newControllerMock.getAllApplications).not.toHaveBeenCalled();
            });
        });

        describe("getApplicationById", () => {
            test("should return 403 if user is not a recruiter", async () => {

                const response = await request(newApp)
                    .get("/api/application/1")
                    .expect(403);

                expect(response.body).toEqual({ success: false, error:errorMsg });
                expect(newControllerMock.getApplicationById).not.toHaveBeenCalled();
            });

        })

        describe("updateApplicationStatus", () => {
            test("should return 403 if user is not a recruiter", async () => {

                const response = await request(newApp)
                    .patch("/api/application/1/status")
                    .send({ status: "accepted" })
                    .expect(403);

                expect(response.body).toEqual({ success: false, error:errorMsg });
                expect(newControllerMock.updateApplicationStatus).not.toHaveBeenCalled();
            });

        });
    })
});

