const BaseDAO = require("./baseDAO");
const Competence = require("../models/competenceModel");

class CompetenceDAO extends BaseDAO {
  constructor() {
    super(Competence);
  }

  async findAllCompetences() {
    return await this.model.findAll();
  }
}

module.exports = CompetenceDAO;
