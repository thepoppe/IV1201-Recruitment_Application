const {sequelize, setupDBWithTables} = require("../localDBsetup.test")
const PersonDAO = require("../../integration/personDAO")
const Person = require("../../models/personModel")

var personDAO = null;
const valid = {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"Password1"}

test("Testing Database access with no data",async () => {
    personDAO = new PersonDAO;
    expect.assertions(1);
    try {
      const person = await personDAO.findByEmail("test@test.se");
      expect(person).toBe(null);
    } catch (error) {
    } finally {
        personDAO = null;
    }
    
});
beforeEach(async () => {
    try {
        await setupDBWithTables();
    } catch (error) {
        console.log(error);
    }
    personDAO = new PersonDAO()
});
  
afterEach(async () => {
    try {
        await Person.destroy({ where: {} });
        personDAO = null;
        
    } catch (error) {
        console.log(error)
    }
        
});

afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
});

test("Testing create Person", async () => {
    try {
        const person = await personDAO.create(valid);
        expect(person.name).toBe("aa");
    } catch (error) {
        throw error
    }
});

test("Testing unique for create Person", async () => {
    const invalid = [
        {name:"aa", surname:"bb", pnr:"11112233-0000", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test2@test.se", password:"Password1"},
    ];

    await Promise.all(invalid.map(async (input) => {
        try {
          await personDAO.create(input);
        } catch (error) {
          expect(error).toBeDefined();
        }
      }));
});
test("Testing validations for create Person", async () => {
    const invalid = [
        {surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"Password1"},
        {name:"aa", pnr:"11112233-1234", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234",  password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se"},
        {name:"a", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"b", pnr:"11112233-1234", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-12341", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-123", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-123a", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"111122331234", email: "test@test.se", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "hej", password:"Password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"Pass"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"Password"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"password1"},
        {name:"aa", surname:"bb", pnr:"11112233-1234", email: "test@test.se", password:"PASSWORD1"},
    ];

    await Promise.all(invalid.map(async (input) => {
        try {
          await personDAO.create(input);
        } catch (error) {
          expect(error).toBeDefined();
        }
      }));
});

test("Test password hashing", async () => {
    expect.assertions(1);
    try {
        const person = await personDAO.create(valid);
        expect(person.password).not.toBe(valid.password);
    } catch (error) {
        throw error
    }
});
test("Test password hashing", async () => {
    expect.assertions(1);
    try {
        const person = await personDAO.create(valid);
        expect(person.password).not.toBe(valid.password);
    } catch (error) {
        throw error
    }
});
test("Test get person by email", async () => {
    expect.assertions(2);
    try {
        var person = await personDAO.findByEmail(valid.email);
        expect(person).toBe(null);
        await personDAO.create(valid);
        person = await personDAO.findByEmail(valid.email);
        expect(person.name).toBe(valid.name);
    } catch (error) {
        throw error
    }
});

test("Test get person by pnr", async () => {
    expect.assertions(2);
    try {
        var person = await personDAO.findByPnr(valid.pnr);
        expect(person).toBe(null);
        await personDAO.create(valid);
        person = await personDAO.findByPnr(valid.pnr);
        expect(person.name).toBe(valid.name);
    } catch (error) {
        throw error
    }
});

test("Test get person by id", async () => {
    expect.assertions(2);
    try {
        var person = await personDAO.findById(1);
        expect(person).toBe(null);
        person = await personDAO.create(valid);
        person = await personDAO.findById(person.dataValues.person_id);
        expect(person).not.toBe(null);
    } catch (error) {
        throw error
    }
});

