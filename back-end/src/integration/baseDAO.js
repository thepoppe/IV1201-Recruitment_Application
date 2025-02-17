/**
 * BaseDAO class for data access objects
 */
class BaseDAO {
  constructor(model) {
    this.model = model;
  }

  /**
   * Creates a new entry in the database
   * @param {Object} data - The data to be inserted into the database
   * @returns {Promise<Object>} - The data that was inserted into the database
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Finds an entry in the database by id
   * @param {number} id - The id of the entry
   * @returns {Promise<Object>} - The entry that was found
   */
  async findById(id) {
    return await this.model.findByPk(id);
  }

  /**
   * Finds all entries in the database
   * @returns {Promise<Object[]>} - All entries that were found
   */
  async findAll() {
    return await this.model.findAll();
  }
}

module.exports = BaseDAO;
