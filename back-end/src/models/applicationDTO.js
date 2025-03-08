const CompetenceProfileDTO = require("./competenceProfileDTO");
const AvailabilityDTO = require("./availabilityDTO");

/**
 * DTO for Application response
 */
class ApplicationDTO {
  constructor(application, person, competences = [], availabilities = []) {
    this.application_id = application.application_id;
    this.status = application.status;
    this.submission_date = application.submission_date;

    // Applicant details
    this.applicant = {
      name: person.name,
      surname: person.surname,
      email: person.email,
    };

    // Competences & Availability
    this.competences = competences.map(
      (competence) => new CompetenceProfileDTO(competence)
    );

    this.availability = availabilities.map(
      (availability) => new AvailabilityDTO(availability)
    );
  }
}

module.exports = ApplicationDTO;
