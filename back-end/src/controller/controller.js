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
const CompetenceProfileDTO = require("../models/competenceProfileDTO");
const AvailabilityDTO = require("../models/availabilityDTO");

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
        `Unexpected error while retrieving person [${person.id}]`,
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
        `Unexpected error while retrieving role of person [${person.id}]`,
        error
      );
    }
  }

  // ############################################################
  // Application related functions
  // Apply for a job
  async applyForJob(person_id) {
    try {
      const existingApplication = await this.applicationDAO.findByPersonId(
        person_id
      );
      if (existingApplication) {
        throw GenericAppError.createBadRequestError(
          "User has already applied."
        );
      }
      const application = await this.applicationDAO.createApplication(
        person_id
      );
      return new ApplicationDTO(application);
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        "Unexpected error while applying for a job",
        error
      );
    }
  }

  // Add competence to application
  async addCompetenceToApplication(
    person_id,
    competence_id,
    years_of_experience
  ) {
    try {
      // Check for duplicates using CompetenceProfileDAO
      const existing = await this.competenceProfileDAO.findCompetence(
        person_id,
        competence_id
      );
      if (existing) {
        throw GenericAppError.createBadRequestError(
          "Competence already exists."
        );
      }

      const competence = await this.competenceProfileDAO.addCompetence(
        person_id,
        competence_id,
        years_of_experience
      );
      return new CompetenceProfileDTO(competence);
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        "Error adding competence",
        error
      );
    }
  }

  // Add availability to application
  async addAvailabilityToApplication(person_id, from_date, to_date) {
    try {
      // Check for overlapping availability using AvailabilityDAO
      const overlap = await this.availabilityDAO.findAvailability(
        person_id,
        from_date,
        to_date
      );
      if (overlap) {
        throw GenericAppError.createBadRequestError(
          "Availability period already exists."
        );
      }

      const availability = await this.availabilityDAO.addAvailability(
        person_id,
        from_date,
        to_date
      );
      return new AvailabilityDTO(availability);
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        "Error adding availability",
        error
      );
    }
  }

  // List all competences
  async listAllCompetences() {
    try {
      return await this.competenceDAO.findAllCompetences();
    } catch (error) {
      throw GenericAppError.createInternalServerError(
        "Error fetching competences",
        error
      );
    }
  }
}

module.exports = Controller;
