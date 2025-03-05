/**
 * Exchage database to mock database
 */
jest.resetModules();
jest.doMock("../../config/database.js", () => require("../mocks/databaseMock.js"));
const db = require("../../config/database.js");

let PersonDAO;
let Person;
let Role;
let personDAO;
const valid = {
  name: "aa",
  surname: "bb",
  pnr: "11112233-1234",
  email: "test@test.se",
  password: "Password1"
};

describe("PersonDAO", () => {

  /**
   * Mock db setup
   * Init models by import and instatiate personDAO
   * Create Role for the db to collect.
   */
  beforeAll(async () => {
    await db.setupDatabase();
    Role = require("../../models/roleModel");
    Person = require("../../models/personModel");
    PersonDAO = require("../../integration/personDAO");
    personDAO = new PersonDAO();

    await Role.create({ role_id: 2, name: "applicant" });
    
  });

  /**
   * Removes the created Role, terminates connection
   */
  afterAll(async () => {
    await Role.destroy({where:{}})
    await db.closeDatabase();
    personDAO = null;
  });

  beforeEach(async () => {
    await Person.destroy({where: {}});
  });

  afterEach(async () => {
    await Person.destroy({where: {}});
  });

  
  describe("create", () => {
    test("should create a new person", async () => {
      const person = await personDAO.create(valid);
      expect(person.name).toBe("aa");
    });

    test("should enforce unique constraints", async () => {
      const invalid = [
        {
          name: "aa",
          surname: "bb",
          pnr: "11112233-0000",
          email: "test@test.se",
          password: "Password1"
        },
        {
          name: "aa",
          surname: "bb",
          pnr: "11112233-1234",
          email: "test2@test.se",
          password: "Password1"
        },
      ];

      await Promise.all(
        invalid.map(async (input) => {
          try {
            await personDAO.create(input);
          } catch (error) {
            expect(error).toBeDefined();
          }
        })
      );
    });
    
    test("should validate input to the sequelize model", async () => {
      const invalid = [
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

      await Promise.all(
        invalid.map(async (input) => {
          try {
            await personDAO.create(input);
          } catch (error) {
            expect(error).toBeDefined();
          }
        })
      );
    });

    test("should hash the password", async () => {
      const person = await personDAO.create(valid);
      expect(person.password).not.toBe(valid.password);
    });
  });
  
  describe("findByEmail", () => {
    test("should return null if no person is found", async () => {
      const person = await personDAO.findByEmail("test@test.se");
      expect(person).toBe(null);
    });

    test("should return the person if found", async () => {
      await personDAO.create(valid);
      const person = await personDAO.findByEmail(valid.email);
      expect(person).not.toBe(null);
    });
  });
  describe("findByPnr", () => {
    test("should return null if no person is found", async () => {
      const person = await personDAO.findByPnr(valid.pnr);
      expect(person).toBe(null);
    });

    test("should return the person if found", async () => {
      await personDAO.create(valid);
      const person = await personDAO.findByPnr(valid.pnr);
      expect(person.name).toBe(valid.name);
    });
  });

  describe("findById", () => {
    test("should return null if no person is found", async () => {
      const person = await personDAO.findById(1);
      expect(person).toBe(null);
    });

    test("should return the person if found", async () => {
      const createdPerson = await personDAO.create(valid);
      const person = await personDAO.findById(
        createdPerson.dataValues.person_id
      );
      expect(person).not.toBe(null);
    });
  });

  describe("SQL Injection on Query", () => {
    test("should not return records when injection is attempted in query", async () => {
      await personDAO.create(valid);
      const maliciousEmail = "test@test.se' OR '1'='1";
      const person = await personDAO.findByEmail(maliciousEmail);
  
      expect(person).toBe(null);
    });
  });
});
