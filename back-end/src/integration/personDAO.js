const BaseDAO = require("./baseDAO");
const Person = require("../models/personModel");

class PersonDAO extends BaseDAO {
  constructor() {
    super(Person);
  }

  async findByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }
}

module.exports = PersonDAO;
