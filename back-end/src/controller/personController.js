const PersonDAO = require("../integration/personDAO");
const PersonDTO = require("../models/personDTO");

class PersonController {
  constructor() {
    this.personDAO = new PersonDAO();
  }

  // Create a new person
  async createPerson(data) {
    const existingPerson = await this.personDAO.findByEmail(data.email);
    if (existingPerson) {
      throw new Error("Email is already in use");
    }

    const person = await this.personDAO.create(data);
    return new PersonDTO(person);
  }

  // Find all persons
  async findAllPersons() {
    const persons = await this.personDAO.findAll();
    return persons.map((person) => new PersonDTO(person));
  }
}

module.exports = PersonController;
