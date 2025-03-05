/**
 * DTO for Competence Profile response
 */
class CompetenceProfileDTO {
  constructor(competenceProfile) {
    this.competence_id = competenceProfile.competence_id;
    this.name = competenceProfile.competence?.name;
    this.years_of_experience = competenceProfile.years_of_experience;
  }
}

module.exports = CompetenceProfileDTO;
