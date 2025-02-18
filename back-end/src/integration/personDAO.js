const BaseDAO = require("./baseDAO");
const Person = require("../models/personModel");

/**
 * Person Data Access Object
 */
class PersonDAO extends BaseDAO {
  constructor() {
    super(Person);
  }

  /**
   * Finds a person by email from the database
   * @param {string} email - The email of the person
   * @returns {Promise<Person>} - The person object as raw data
   */
  async findByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }

  /**
   * Finds a person by pnr from the database
   * @param {string} pnr - The personal number of the person
   * @returns {Promise<Person>} - The person object as raw data
   */
  async findByPnr(pnr) {
    return await this.model.findOne({ where: { pnr } });
  }
}

module.exports = PersonDAO;
