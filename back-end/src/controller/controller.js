const bcrypt = require("bcrypt");
const GenericAppError = require("../utils/genericAppError");
// DAO imports
const PersonDAO = require("../integration/personDAO");
const ApplicationDAO = require("../integration/applicationDAO");
const CompetenceProfileDAO = require("../integration/competenceProfileDAO");
const AvailabilityDAO = require("../integration/availabilityDAO");
const CompetenceDAO = require("../integration/competenceDAO");
// DTO imports
const PersonDTO = require("../models/personDTO");
const ApplicationDTO = require("../models/applicationDTO");
const CompetenceDTO = require("../models/competenceDTO");

/**
 * Controller class for handling Requests
 */
class Controller {
  /**
   * Constructor for the Controller
   */
  constructor() {
    this.personDAO = new PersonDAO();
    this.applicationDAO = new ApplicationDAO();
    this.competenceProfileDAO = new CompetenceProfileDAO();
    this.availabilityDAO = new AvailabilityDAO();
    this.competenceDAO = new CompetenceDAO();
  }

  /**
   * Checks if the person exists in the database, if not creates a new person
   * @param {Object} person - The person object containing name, surname, pnr, email, and password
   * @param {string} person.name - The name of the person
   * @param {string} person.surname - The surname of the person
   * @param {string} person.pnr - The personal number of the person
   * @param {string} person.email - The email of the person
   * @param {string} person.password - The password of the person
   * @returns {Promise<PersonDTO>}
   * @throws {GenericAppError} `400 Bad Request` - If the provided personal number (PNR) is already registered
   * @throws {GenericAppError} `400 Bad Request` - If the provided email is already registered
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async createPerson(person) {
    try {
      const pnr = await this.personDAO.findByPnr(person.pnr);
      if (pnr) {
        throw GenericAppError.createBadRequestError(
          "User entered a PNR that is already registered."
        );
      }
      const email = await this.personDAO.findByEmail(person.email);
      if (email) {
        throw GenericAppError.createBadRequestError(
          "User entered an Email that is already registered."
        );
      }

      const user = await this.personDAO.create(person);
      return new PersonDTO(user);
    } catch (error) {
      console.log("Error from createAccount, for testing: ", error);
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
          "Unexpected error while creating a person",
          error
        );
    }
  }

  /**
   * Finds all persons in the database
   * @returns {Promise<PersonDTO[]>}
   * @throws {GenericAppError} `404 - Not found` - If there are no persons in the database
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async findAllPersons() {
    try {
      const persons = await this.personDAO.findAll();
      if (persons.length === 0) {
        throw GenericAppError.createNotFoundError("No entries in the database");
      }
      return persons.map((person) => new PersonDTO(person));
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        "Unexpected error while retrieving all persons",
        error
      );
    }
  }

  /**
   * Logs in the person if the email and password are correct
   * @param {Object} req_params - The person object containing email and password
   * @param {string} req_params.email - The email of the person
   * @param {string} req_params.password - The password of the person
   * @returns {Promise<PersonDTO>}
   * @throws {GenericAppError} `400 - Bad Request` - If no user with that email
   * @throws {GenericAppError} `400 - Bad Request`- If the password is incorrect
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async login(req_params) {
    try {
      const user = await this.personDAO.findByEmail(req_params.email);
      if (!user) {
        throw GenericAppError.createAuthenticationError(
          "Invalid email was given.",
          null,
          "Email and Password does not match"
        );
      }
      const isPasswordValid = await bcrypt.compare(
        req_params.password,
        user.password
      );
      if (!isPasswordValid) {
        throw GenericAppError.createAuthenticationError(
          "Invalid password was given.",
          null,
          "Email and Password does not match"
        );
      }

      return new PersonDTO(user);
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
          `Unexpected error while logging in person [${req_params.email}] all persons`,
          error
        );
    }
  }

  /**
   * Finds a person by their id
   * @param {number} person_id - The id of the person
   * @returns {Promise<PersonDTO>}
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async getPersonData(person_id) {
    try {
      const user = await this.personDAO.findById(person_id);
      return new PersonDTO(user);
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        `Unexpected error while retrieving person [${person_id}]`,
        error
      );
    }
  }

  /**
   * Finds the role of the user
   * @param {number} person_id - The id of the person
   * @returns {Promise<string>}
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async getUserRole(person_id) {
    try {
      const user = await this.personDAO.findById(person_id);
      const role = await this.personDAO.findRoleById(user.role_id);
      return role.name;
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        `Unexpected error while retrieving role of person [${person_id}]`,
        error
      );
    }
  }

  // ############################################################
  // Application related functions

  /**
   * Apply for a job
   * @param {number} person_id - The ID of the person applying for the job
   * @param {Array<number>} competences - The IDs of the competences the person has
   * @param {Array<Object>} availabilities - The availabilities of the person
   * @param {string} availabilities.from_date - The start date of the availability
   * @param {string} availabilities.to_date - The end date of the availability
   * @returns {Promise<ApplicationDTO>}
   * @throws {GenericAppError} `400 Bad Request` - If the user has already applied
   * @throws {GenericAppError} `404 Not Found` - If the applicant is not found
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error
   */
  async applyForJob(person_id, competences, availabilities) {
    try {
      const existingApplication = await this.applicationDAO.findByPersonId(
        person_id
      );
      if (existingApplication) {
        throw GenericAppError.createBadRequestError(
          "User has already applied."
        );
      }

      // Fetch applicant information
      const applicant = await this.personDAO.findById(person_id);
      if (!applicant) {
        throw GenericAppError.createNotFoundError("Applicant not found.");
      }

      // Apply for job transactionally
      const application = await this.applicationDAO.applyForJobTransactionally(
        person_id,
        competences,
        availabilities
      );

      return new ApplicationDTO(
        application,
        applicant,
        competences,
        availabilities
      );
    } catch (error) {
      console.log("Error from applyForJob, for testing: ", error);
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
        "Unexpected error while applying for a job",
        error
      );
    }
  }

  /**
   * List all competences
   * @returns {Promise<CompetenceDTO[]>}
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   * */
  async listAllCompetences() {
    try {
      const competences = await this.competenceDAO.findAllCompetences();
      return competences.map((competence) => new CompetenceDTO(competence));
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
          "Unexpected error while retrieving all competences",
          error
        );
    }
  }

  /**
   * Get user application for the authenticated user
   * @param {number} person_id - The ID of the person
   * @returns {Promise<ApplicationDTO>}
   * @throws {GenericAppError} `404 Not Found` - If no application is found for the user
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   * */
  async getUserApplication(person_id) {
    try {
      const application = await this.applicationDAO.findApplicationByPersonId(
        person_id
      );
      if (!application) {
        throw GenericAppError.createNotFoundError(
          "No application found for this user."
        );
      }

      return new ApplicationDTO(
        application,
        application.person,
        application.competences,
        application.availability
      );
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
        "Unexpected error while retrieving user application",
        error
      );
    }
  }

  /**
   * Fetch all applications (Recruiter only)
   * @returns {Promise<Array<ApplicationDTO>>}
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async getAllApplications() {
    try {
      const applications = await this.applicationDAO.findAllApplications();
      return applications.map((app) => new ApplicationDTO(app, app.person, app.competences, app.availability));
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
          "Unexpected error while retrieving all applications",
          error
        );
    }
  }

  /**
   * Fetch a single application by ID
   * @param {number} application_id - The ID of the application
   * @returns {Promise<ApplicationDTO>}
   * @throws {GenericAppError} `404 Not Found` - If the application is not found
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async getApplicationById(application_id) {
    try {
      const application = await this.applicationDAO.findApplicationById(application_id);
      if (!application) {
        throw GenericAppError.createNotFoundError("Application not found");
      }
      
      return new ApplicationDTO(application, application.person, application.competences, application.availability);
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
        `Unexpected error while retrieving application [${application_id}]`,
        error
      );
    }
  }

  /**
   * Update the status of an application
   * @param {number} application_id - The ID of the application
   * @param {string} status - The new status ('accepted' or 'rejected')
   * @returns {Promise<ApplicationDTO>}
   * @throws {GenericAppError} `400 Bad Request` - If the status is invalid
   * @throws {GenericAppError} `404 Not Found` - If the application is not found
   * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
   */
  async updateApplicationStatus(application_id, status) {
    try {
      const application = await this.applicationDAO.findApplicationById(application_id);
      if (!application) {
        throw GenericAppError.createNotFoundError("Application not found");
      }

      if (!["accepted", "rejected"].includes(status)) {
        throw GenericAppError.createBadRequestError("Invalid status");
      }

      application.status = status;
      await application.save();

      return new ApplicationDTO(application, application.person, application.competences, application.availability);
    } catch (error) {
      if (error instanceof GenericAppError) throw error;
      else
        throw GenericAppError.createInternalServerError(
        `Unexpected error while updating application [${application_id}] status`,
        error
      );
    }
  }


}

module.exports = Controller;
