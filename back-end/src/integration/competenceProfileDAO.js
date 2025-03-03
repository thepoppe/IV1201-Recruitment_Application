const BaseDAO = require("./baseDAO");
const CompetenceProfile = require("../models/competenceProfileModel");

class CompetenceProfileDAO extends BaseDAO {
  constructor() {
    super(CompetenceProfile);
  }

  async findCompetence(person_id, competence_id) {
    return await this.model.findOne({ where: { person_id, competence_id } });
  }

  async addCompetence(person_id, competence_id, years_of_experience) {
    return await this.model.create({
      person_id,
      competence_id,
      years_of_experience,
    });
  }
}

module.exports = CompetenceProfileDAO;
