const Controller = require("../../controller/controller");
const PersonDTO = require("../../models/personDTO");
const ApplicationDTO = require("../../models/applicationDTO");
const CompetenceDTO = require("../../models/competenceDTO");
const PersonDAO = require("../../integration/personDAO");
const ApplicationDAO = require("../../integration/applicationDAO");
const CompetenceDAO = require("../../integration/competenceDAO");
const bcrypt = require("bcrypt");
const GenericAppError = require("../../utils/genericAppError");

jest.mock("bcrypt");
jest.mock("../../integration/personDAO");
jest.mock("../../integration/applicationDAO");
jest.mock("../../integration/competenceDAO");

PersonDAO.mockImplementation(() => ({
    findByPnr: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findRoleById: jest.fn()
}));

ApplicationDAO.mockImplementation(() => ({
    findByPersonId: jest.fn(),
    applyForJobTransactionally: jest.fn(),
    findApplicationByPersonId: jest.fn(),
    findAllApplications: jest.fn(),
    findApplicationById: jest.fn()
}));

CompetenceDAO.mockImplementation(() => ({
    findAllCompetences: jest.fn()
}));

describe("Controller", () => {
    let controller;
    let personDAOMock;
    let applicationDAOMock;
    let competenceDAOMock;

    beforeAll(async () => {
        controller = new Controller();
        personDAOMock = new PersonDAO();
        applicationDAOMock = new ApplicationDAO();
        competenceDAOMock = new CompetenceDAO();
        controller.personDAO = personDAOMock;
        controller.applicationDAO = applicationDAOMock;
        controller.competenceDAO = competenceDAOMock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        controller = null;
    });
    describe("PersonAPI tests", () =>{

        describe("createPerson", () => {
            const person = { name: "John", surname: "Doe", pnr: "12345678-2390", email: "john.doe@example.com", password: "Password1" };
            test("should create a new person if PNR and email are not registered", async () => {
                personDAOMock.findByPnr.mockResolvedValue(null);
                personDAOMock.findByEmail.mockResolvedValue(null);
                personDAOMock.create.mockResolvedValue(person);

                const result = await controller.createPerson(person);
                expect(result).toEqual(new PersonDTO(person));
            });

            test("should throw an error if PNR is already registered", async () => {
                personDAOMock.findByPnr.mockResolvedValue(person);

                await expect(controller.createPerson(person)).rejects.toThrow(GenericAppError);
            });

            test("should throw an error if email is already registered", async () => {
                personDAOMock.findByPnr.mockResolvedValue(null);
                personDAOMock.findByEmail.mockResolvedValue(person);

                await expect(controller.createPerson(person)).rejects.toThrow(GenericAppError);
            });

            test("should throw error if DAO fails", async () => {
                personDAOMock.findByPnr.mockResolvedValue(null);
                personDAOMock.findByEmail.mockResolvedValue(null);
                personDAOMock.create.mockRejectedValue(new Error());

                await expect(controller.createPerson(person)).rejects.toThrow(GenericAppError);
            });
        });

        describe("login", () => {
            const person = { email: "john.doe@example.com", password: "hashedPassword" };
            const req_params = { email: "john.doe@example.com", password: "password" };
            test("should login the person if email and password are correct", async () => {
                personDAOMock.findByEmail.mockResolvedValue(person);
                bcrypt.compare.mockResolvedValue(true);

                const result = await controller.login(req_params);
                expect(result).toEqual(new PersonDTO(person));
            });

            test("should throw an error if email is incorrect", async () => {
                personDAOMock.findByEmail.mockResolvedValue(null);

                await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
            });

            test("should throw an error if password is incorrect", async () => {
                personDAOMock.findByEmail.mockResolvedValue(person);
                bcrypt.compare.mockResolvedValue(false);

                await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
            });
            test("should throw error if DAO fails", async () => {
                personDAOMock.findByEmail.mockResolvedValue(new Error());

                await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
            });
            test("should throw error id bcrypt fails", async () => {
                personDAOMock.findByEmail.mockResolvedValue(person);
                bcrypt.compare.mockRejectedValue(new Error());

                await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
            });
        });

        describe("getPersonData", () => {
            const person = { id: 1, name: "John", surname: "Doe" };
            test("should return person data by id", async () => {
                personDAOMock.findById.mockResolvedValue(person);

                const result = await controller.getPersonData(1);
                expect(result).toEqual(new PersonDTO(person));
            });
            test("should throw error if DAO fails", async () => {
                personDAOMock.findById.mockRejectedValue(new Error());

                await expect(controller.getPersonData(1)).rejects.toThrow(GenericAppError);
            });
        });

        describe("getUserRole", () => {
            const person = { id: 1, role_id: 1 };
            const role = { name: "recruiter" };
            test("should return the role of the user by id", async () => {
                personDAOMock.findById.mockResolvedValue(person);
                personDAOMock.findRoleById.mockResolvedValue(role);

                const result = await controller.getUserRole(1);
                expect(result).toEqual(role.name);
            });
            test("should throw error if DAO.findById fails", async () => {
                personDAOMock.findById.mockRejectedValue(new Error());
                personDAOMock.findRoleById.mockResolvedValue(role);

                await expect(controller.getUserRole(1)).rejects.toThrow(GenericAppError);
            });
            test("should throw error if DAO.findRoleById fails", async () => {
                personDAOMock.findById.mockResolvedValue(person);
                personDAOMock.findRoleById.mockRejectedValue(new Error());

                await expect(controller.getUserRole(1)).rejects.toThrow(GenericAppError);
            });

        });
    })  
    
    describe("ApplicationAPI tests", () => {
        
        const person_id = 1;
        const competences = [1, 2];
        const availabilities = [{ from_date: "2023-01-01", to_date: "2023-01-31" }];
        const person = { id: person_id, name: "John", surname: "Doe" };
        const application = { id: 1, person_id, competences, availabilities };
        describe("applyForJob", () => {

            test("should apply for a job if the user has not already applied", async () => {
                personDAOMock.findById.mockResolvedValue(person);
                applicationDAOMock.findByPersonId.mockResolvedValue(null);
                applicationDAOMock.applyForJobTransactionally.mockResolvedValue(application);

                const result = await controller.applyForJob(person_id, competences, availabilities);
                expect(result).toEqual(new ApplicationDTO(application, person, competences, availabilities));
            });

            test("should throw an error if the user has already applied", async () => {
                applicationDAOMock.findByPersonId.mockResolvedValue(application);

                await expect(controller.applyForJob(person_id, competences, availabilities)).rejects.toThrow(GenericAppError);
            });

            test("should throw an error if the applicant is not found", async () => {
                personDAOMock.findById.mockResolvedValue(null);

                await expect(controller.applyForJob(person_id, competences, availabilities)).rejects.toThrow(GenericAppError);
            });

            test("should throw error if DAO fails", async () => {
                personDAOMock.findById.mockRejectedValue(new Error());

                await expect(controller.applyForJob(person_id, competences, availabilities)).rejects.toThrow(GenericAppError);
            });
        });

        describe("listAllCompetences", () => {
            const competences = [{ id: 1, name: "Competence1" }, { id: 2, name: "Competence2" }];
            test("should list all competences", async () => {
                competenceDAOMock.findAllCompetences.mockResolvedValue(competences);

                const result = await controller.listAllCompetences();
                expect(result).toEqual(competences.map((competence) => new CompetenceDTO(competence)));
            });
            test("should throw error if DAO fails", async () => {
                competenceDAOMock.findAllCompetences.mockRejectedValue(new Error());

                await expect(controller.listAllCompetences()).rejects.toThrow(GenericAppError);
            });
        });

        describe("getUserApplication", () => {
            test("should return the application for the authenticated user", async () => {
                const application_id = 1
                const application = { 
                    id: application_id, 
                    person: person, 
                    competences: competences, 
                    availability: availabilities, 
                    status: "pending" 
                };
                applicationDAOMock.findApplicationByPersonId.mockResolvedValue(application);

                const result = await controller.getUserApplication(person_id);
                expect(result).toEqual(new ApplicationDTO(application, application.person, application.competences, application.availability));
            });

            test("should throw an error if no application is found for the user", async () => {
                applicationDAOMock.findApplicationByPersonId.mockResolvedValue(null);

                await expect(controller.getUserApplication(person_id)).rejects.toThrow(GenericAppError);
            });
            test("should throw error if DAO fails", async () => {
                applicationDAOMock.findApplicationByPersonId.mockRejectedValue(new Error());

               await expect(controller.getUserApplication(person_id)).rejects.toThrow(GenericAppError);
            });
        });

        describe("getAllApplications", () => {
            const applications = [{ id: 1, person: {}, competences: [], availability: [] }];
            test("should fetch all applications", async () => {
                applicationDAOMock.findAllApplications.mockResolvedValue(applications);

                const result = await controller.getAllApplications();
                expect(result).toEqual(applications.map((app) => new ApplicationDTO(app, app.person, app.competences, app.availability)));
            });
            test("should throw error if DAO fails", async () => {
                applicationDAOMock.findAllApplications.mockRejectedValue(new Error());

                await expect(controller.getAllApplications()).rejects.toThrow(GenericAppError);
            });
        });

        describe("getApplicationById", () => {
            const application_id = 1;
            const application = { id: application_id, person: {}, competences: [], availability: [] };
            test("should fetch a single application by ID", async () => {
                applicationDAOMock.findApplicationById.mockResolvedValue(application);

                const result = await controller.getApplicationById(application_id);
                expect(result).toEqual(new ApplicationDTO(application, application.person, application.competences, application.availability));
            });

            test("should throw an error if the application is not found", async () => {
                applicationDAOMock.findApplicationById.mockResolvedValue(null);

                await expect(controller.getApplicationById(application_id)).rejects.toThrow(GenericAppError);
            });

            test("should throw error if DAO fails", async () => {
                applicationDAOMock.findAllApplications.mockRejectedValue(new Error());

                await expect(controller.getAllApplications()).rejects.toThrow(GenericAppError);
            });
        });

        describe("updateApplicationStatus", () => {
            const application_id = 1;
            const status = "accepted";
            const application = { 
                id: application_id, 
                person: person, 
                competences: competences, 
                availability: availabilities, 
                status: "pending" 
            };
            test("should update the status of an application", async () => {
                applicationDAOMock.findApplicationById.mockResolvedValue(application);
                application.save = jest.fn().mockResolvedValue(application);

                const result = await controller.updateApplicationStatus(application_id, status);
                expect(application.status).toBe(status);
                expect(result).toEqual(new ApplicationDTO(application, application.person, application.competences, application.availability));
            });

            test("should throw an error if the application is not found", async () => {
                applicationDAOMock.findApplicationById.mockResolvedValue(null);

                await expect(controller.updateApplicationStatus(application_id, status)).rejects.toThrow(GenericAppError);
            });

            test("should throw an error if the status is invalid", async () => {
                const badStatus = "invalid_status";

                applicationDAOMock.findApplicationById.mockResolvedValue(application);

                await expect(controller.updateApplicationStatus(application_id, badStatus)).rejects.toThrow(GenericAppError);
            });

            test("should throw error if DAO fails", async () => {
                applicationDAOMock.findApplicationById.mockRejectedValue(new Error());

                await expect(controller.updateApplicationStatus(application_id, status)).rejects.toThrow(GenericAppError);
            });
        });
    });
});