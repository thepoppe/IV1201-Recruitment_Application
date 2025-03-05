const Controller = require("../../controller/controller");
const PersonDTO = require("../../models/personDTO");
const PersonDAO = require("../../integration/personDAO");
const bcrypt = require("bcrypt");
const GenericAppError = require("../../utils/genericAppError");

jest.mock("bcrypt");
jest.mock("../../integration/personDAO");


describe("Controller", () => {
    let controller;

    beforeAll(async () => {
        controller = new Controller();
    });

    afterAll(async () => {
        controller = null;
    });


    describe("createPerson", () => {
        test("should create a new person if PNR and email are not registered", async () => {
            const person = { name: "John", surname: "Doe", pnr: "12345678-2390", email: "john.doe@example.com", password: "Password1" };
            PersonDAO.prototype.findByPnr.mockResolvedValue(null);
            PersonDAO.prototype.findByEmail.mockResolvedValue(null);
            PersonDAO.prototype.create.mockResolvedValue(person);

            const result = await controller.createPerson(person);

            expect(result).toEqual(new PersonDTO(person));
        });

        test("should throw an error if PNR is already registered", async () => {
            const person = { name: "John", surname: "Doe", pnr: "1234567890", email: "john.doe@example.com", password: "Password1" };
            PersonDAO.prototype.findByPnr.mockResolvedValue(person);

            await expect(controller.createPerson(person)).rejects.toThrow(GenericAppError);
        });

        test("should throw an error if email is already registered", async () => {
            const person = { name: "John", surname: "Doe", pnr: "1234567890", email: "john.doe@example.com", password: "Password1" };
            PersonDAO.prototype.findByPnr.mockResolvedValue(null);
            PersonDAO.prototype.findByEmail.mockResolvedValue(person);

            await expect(controller.createPerson(person)).rejects.toThrow(GenericAppError);
        });
    });

    describe("login", () => {
        test("should login the person if email and password are correct", async () => {
            const person = { email: "john.doe@example.com", password: "hashedPassword" };
            const req_params = { email: "john.doe@example.com", password: "password" };
            PersonDAO.prototype.findByEmail.mockResolvedValue(person);
            bcrypt.compare.mockResolvedValue(true);

            const result = await controller.login(req_params);

            expect(result).toEqual(new PersonDTO(person));
        });

        test("should throw an error if email is incorrect", async () => {
            const req_params = { email: "john.doe@example.com", password: "password" };
            PersonDAO.prototype.findByEmail.mockResolvedValue(null);

            await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
        });

        test("should throw an error if password is incorrect", async () => {
            const person = { email: "john.doe@example.com", password: "hashedPassword" };
            const req_params = { email: "john.doe@example.com", password: "password" };
            PersonDAO.prototype.findByEmail.mockResolvedValue(person);
            bcrypt.compare.mockResolvedValue(false);

            await expect(controller.login(req_params)).rejects.toThrow(GenericAppError);
        });
    });

    describe("getPersonData", () => {
        test("should return person data by id", async () => {
            const person = { id: 1, name: "John", surname: "Doe" };
            PersonDAO.prototype.findById.mockResolvedValue(person);

            const result = await controller.getPersonData(1);

            expect(result).toEqual(new PersonDTO(person));
        });
    });

    describe("getUserRole", () => {
        test("should return the role of the user by id", async () => {
            const person = { id: 1, role_id: 1 };
            const role = { name: "recruiter" };
            PersonDAO.prototype.findById.mockResolvedValue(person);
            PersonDAO.prototype.findRoleById.mockResolvedValue(role);

            const result = await controller.getUserRole(1);

            expect(result).toEqual(role.name);
        });
    });
});