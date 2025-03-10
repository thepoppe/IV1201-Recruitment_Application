const BaseDAO = require("./baseDAO");
const Person = require("../models/personModel");
const Application = require("../models/applicationModel");
const Competence = require("../models/competenceModel");
const CompetenceProfile = require("../models/competenceProfileModel");
const Availability = require("../models/availabilityModel");
const db = require("../config/database"); // Sequelize instance

class ApplicationDAO extends BaseDAO {
  constructor() {
    super(Application);
  }

  /**
   * Finds an application by the applicant's ID
   * @param {number} person_id - The applicant's ID
   * @returns {Promise<Object>} The application
   */
  async findByPersonId(person_id) {
    return await this.model.findOne({ where: { person_id } });
  }

  /**
   * Creates an application, availability, and competence profile in one transaction
   * @param {number} person_id - The applicant's ID
   * @param {Array} competences - List of competences with years of experience [{ competence_id, years_of_experience }]
   * @param {Array} availabilities - List of availability periods [{ from_date, to_date }]
   * @returns {Promise<Object>} The created application
   */
  async applyForJobTransactionally(person_id, competences, availabilities) {
    const transaction = await db.getSequelize().transaction();

    try {
      // 1) create the application
      const application = await Application.create(
        { person_id },
        { transaction }
      );
    
      // 2) create competence profiles for that same person
      for (const comp of competences) {
        await CompetenceProfile.create(
          {
            person_id,
            competence_id: comp.competence_id,
            years_of_experience: comp.years_of_experience,
          },
          { transaction }
        );
      }
    
      // 3) create availability intervals for that same person
      for (const avail of availabilities) {
        await Availability.create(
          {
            person_id,
            from_date: avail.from_date,
            to_date: avail.to_date,
          },
          { transaction }
        );
      }
    
      await transaction.commit();
      return application;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Finds an application by the applicant's ID with associated competences and availability
   * @param {number} person_id - The applicant's ID
   * @returns {Promise<Object>} The application with competences and availability
   */
  async findApplicationByPersonId(person_id) {
    return await this.model.findOne({
      where: { person_id },
      // Only Person is directly associated with Application
      include: [
        {
          model: Person,
          as: "person",
          attributes: ["name", "surname", "email"],
          // NEST the child's includes here, under the Person
          include: [
            {
              model: CompetenceProfile,
              as: "competences",
              include: [
                {
                  model: Competence,
                  as: "competence",
                  attributes: ["name"],
                },
              ],
            },
            {
              model: Availability,
              as: "availability",
            },
          ],
        },
      ],
    });
  }
  

  /**
   * Fetch all applications
   * @returns {Promise<Array<Application>>} - List of all applications
   */
  async findAllApplications() {
    return await this.model.findAll({
      include: [
        { model: Person, as: "person", attributes: ["name", "surname", "email"] },
        { model: CompetenceProfile, as: "competences", include: [{ model: Competence, as: "competence", attributes: ["name"] }] },
        { model: Availability, as: "availability" }
      ],
    });
  }

  /**
   * Fetch a single application by ID
   * @param {number} application_id - The application ID
   * @returns {Promise<Application>} - The application object
   */
  async findApplicationById(application_id) {
    return await this.model.findOne({
      where: { application_id },
      include: [
        {
          model: Person,
          as: "person",
          attributes: ["name", "surname", "email"],
          // NEST the other includes inside Person
          include: [
            {
              model: CompetenceProfile,
              as: "competences",
              // If you also want the "Competence" name:
              include: [
                {
                  model: Competence,
                  as: "competence",
                  attributes: ["name"]
                }
              ]
            },
            {
              model: Availability,
              as: "availability"
            }
          ]
        }
      ]
    });
  }


}

module.exports = ApplicationDAO;
