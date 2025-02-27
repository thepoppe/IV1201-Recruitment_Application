/**
 * DTO for Application response
 */
class ApplicationDTO {
  constructor(application) {
    this.application_id = application.application_id;
    this.status = application.status;
    this.submission_date = application.submission_date;
    this.applicant = {
      name: application.person?.name,
      surname: application.person?.surname,
      email: application.person?.email,
    };
    this.competences = application.competences?.map(
      (competence) => new CompetenceProfileDTO(competence)
    );
    this.availability = application.availability?.map(
      (availability) => new AvailabilityDTO(availability)
    );
  }
}

module.exports = ApplicationDTO;
