/**
 * DTO for Competence response
 */
class CompetenceDTO {
  constructor(competence) {
    this.competence_id = competence.competence_id;
    this.name = competence.name;
  }
}

module.exports = CompetenceDTO;
