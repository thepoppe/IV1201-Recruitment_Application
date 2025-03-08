/**
 * Exchage database to mock database
 */
jest.resetModules();
jest.doMock("../../config/database.js", () => require("../mocks/databaseMock.js"));
const db = require("../../config/database.js");
const {clearDatabase} = require("../mocks/databaseMock.js")

let ApplicationDAO, PersonDAO;
let Application, Person, Competence, CompetenceProfile, Availability, Role;
let applicationDAO, personDAO;
const competences = [
    { competence_id: 1, years_of_experience: 5 },
    { competence_id: 2, years_of_experience: 3 },
  ];
const availabilities = [{ from_date: "2023-01-01", to_date: "2023-01-31" }];

let uniqueCounter = 1000;
function generateUniquePerson() {
  const suffix = uniqueCounter++;
  return {
    name: "John",
    surname: "Doe",
    pnr: `12341122-${suffix}`, // Unique pnr per call
    email: `john${suffix}@finnsinte.se`, // Unique email per call
    password: "Password1",
  };
}


describe("ApplicationDAO", () => {

  /**
   * Mock db setup
   * Init models by import and instatiate applicaitonDAO
   * Create Needed rows in DB
   */
  beforeAll(async () => {
    await db.setupDatabase();
    await db.clearDatabase();

    Application = require("../../models/applicationModel");
    Role = require("../../models/roleModel");
    Person = require("../../models/personModel");
    CompetenceProfile = require("../../models/competenceProfileModel");
    Availability = require("../../models/availabilityModel");
    Competence = require("../../models/competenceModel");

    await db.getSequelize().sync({ force: true });

    ApplicationDAO = require("../../integration/applicationDAO");
    applicationDAO = new ApplicationDAO();

    PersonDAO = require("../../integration/personDAO");
    personDAO = new PersonDAO();


    await Role.create({ role_id: 2, name: "applicant" });
    await Competence.create({ competence_id: 1, name: "Competence One" });
    await Competence.create({ competence_id: 2, name: "Competence Two" });

});

beforeEach(async () => {
});

afterEach(async () => {
    await Application.destroy({ where: {} });
});

afterAll(async () => {
    await db.clearDatabase();
    await db.closeDatabase();
});
    describe("applyForJobTransactionally",() =>{

        
        test("should create a new application", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const result = await applicationDAO.applyForJobTransactionally(person_id, competences, availabilities);

            expect(result).toHaveProperty("application_id");
            expect(result.person_id).toBe(person_id);
            expect(result.status).toBe("unhandled");
            expect(result.submission_date).toBeDefined();
            
            expect(result.competences).toBeDefined();
            expect(Array.isArray(result.competences)).toBe(true);
            expect(result.competences.length).toBe(2);
            
            expect(result.availability).toBeDefined();
            expect(Array.isArray(result.availability)).toBe(true);
            expect(result.availability.length).toBe(1);
        });

        test("should rollback transaction if competenceProfile fails", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const invalidCompetences = [
              { competence_id: 999, years_of_experience: 10 },
              { competence_id: 2, years_of_experience: 3 },
            ];
        
            await expect(
              applicationDAO.applyForJobTransactionally(person_id, invalidCompetences, availabilities)
            ).rejects.toThrow();
        
            const applications = await Application.findAll({ where: { person_id } });
            expect(applications.length).toBe(0);
        });

        test("should rollback transaction if availibility fails", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const invalidAvailabilities = [{ from_date: "2023-01-01" }];
        
            await expect(
              applicationDAO.applyForJobTransactionally(person_id, competences, invalidAvailabilities)
            ).rejects.toThrow();
        
            const applications = await Application.findAll({ where: { person_id } });
            expect(applications.length).toBe(0);
        });

        test("should rollback transaction if person does not exist", async () => {
            const nonExistentPersonId = 9999;
            
            await expect(
              applicationDAO.applyForJobTransactionally(nonExistentPersonId, competences, availabilities)
            ).rejects.toThrow();
            
            const applications = await Application.findAll({ where: { person_id: nonExistentPersonId } });
            expect(applications.length).toBe(0);
          });
    });


    describe("FindApplicationByPersonID", () => {
  
        test("should return an application", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const res = await applicationDAO.applyForJobTransactionally(person_id, competences, availabilities);
            
            const found = await applicationDAO.findApplicationByPersonId(person_id);
            
            expect(found.dataValues.application_id).toEqual(res.dataValues.application_id);
            expect(found.dataValues.person_id).toEqual(person_id);
            expect(found.dataValues.status).toEqual(res.dataValues.status);
            expect(found.person.dataValues.email).toEqual(storedPerson.email);
            
        });
        
        
        test("should return null if application does not exist", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            
            const foundApp = await applicationDAO.findByPersonId(person_id);

            expect(foundApp).toBeNull();
        });
        
        test("should return null for a non-existent person id", async () => {
            const nonExistentPersonId = 9999;
            const foundApp = await applicationDAO.findByPersonId(nonExistentPersonId);
          
            expect(foundApp).toBeNull();
        });
      });
    describe("FindApplicationByApplicationID", () => {
  
        test("should return an application", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const res = await applicationDAO.applyForJobTransactionally(person_id, competences, availabilities);
          
            const found = await applicationDAO.findApplicationById(res.dataValues.application_id);
        
            expect(found.dataValues.application_id).toEqual(res.dataValues.application_id);
            expect(found.dataValues.person_id).toEqual(person_id);
            expect(found.dataValues.status).toEqual(res.dataValues.status);
            expect(found.person.dataValues.email).toEqual(storedPerson.email);
        });
        
        
        test("should return null if application id does not exist", async () => {
            const invalidAppliID = 9999;
            const foundApp = await applicationDAO.findApplicationById(invalidAppliID);

            expect(foundApp).toBeNull();
        });
        test("should return null if application id is wrong", async () => {
            const invalidAppliID = "Test";
            const foundApp = await applicationDAO.findApplicationById(invalidAppliID);

            expect(foundApp).toBeNull();
        });
        
    });

    describe("findAllApplications", () => {
        test("should return 0 applications", async () => {
            const applications = await applicationDAO.findAllApplications();

            expect(applications).toEqual([]);
            expect(applications).toHaveLength(0);
        });
        test("should return 1 applications", async () => {
            const storedPerson = await Person.create(generateUniquePerson());
            const person_id = storedPerson.dataValues.person_id;
            const res = await applicationDAO.applyForJobTransactionally(person_id, competences, availabilities);
          
            const applications = await applicationDAO.findAllApplications();
        
            expect(applications).toHaveLength(1);
            expect(applications[0].dataValues.application_id).toBe(res.dataValues.application_id);
        });
    })

      
      
});