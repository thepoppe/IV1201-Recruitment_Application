const PersonDAO = require("../integration/personDAO");
const PersonDTO = require("../models/personDTO");

class PersonController {
  constructor() {
    this.personDAO = new PersonDAO();
  }

  async createPerson(data) {
    const existingPerson = await this.personDAO.findByEmail(data.email);
    if (existingPerson) {
      throw new Error("Email is already in use");
    }

    const person = await this.personDAO.create(data);
    return new PersonDTO(person);
  }
}

module.exports = PersonController;
