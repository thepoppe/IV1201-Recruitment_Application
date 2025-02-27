const BaseDAO = require("./baseDAO");
const Application = require("../models/applicationModel");

class ApplicationDAO extends BaseDAO {
  constructor() {
    super(Application);
  }

  async findByPersonId(person_id) {
    return await this.model.findOne({ where: { person_id } });
  }

  async createApplication(person_id) {
    return await this.model.create({ person_id });
  }
}

module.exports = ApplicationDAO;
