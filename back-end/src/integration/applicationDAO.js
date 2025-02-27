const BaseDAO = require("./baseDAO");
const Application = require("../models/applicationModel");
const CompetenceProfile = require("../models/competenceProfileModel");
const Availability = require("../models/availabilityModel");
const db = require("../config/database"); // Sequelize instance

class ApplicationDAO extends BaseDAO {
  constructor() {
    super(Application);
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
      // Step 1: Create Application
      const application = await Application.create(
        { person_id },
        { transaction }
      );

      // Step 2: Create Competence Profile (if provided)
      if (competences.length > 0) {
        const competenceEntries = competences.map((comp) => ({
          person_id,
          competence_id: comp.competence_id,
          years_of_experience: comp.years_of_experience,
        }));
        await CompetenceProfile.bulkCreate(competenceEntries, { transaction });
      }

      // Step 3: Create Availability (if provided)
      if (availabilities.length > 0) {
        const availabilityEntries = availabilities.map((avail) => ({
          person_id,
          from_date: avail.from_date,
          to_date: avail.to_date,
        }));
        await Availability.bulkCreate(availabilityEntries, { transaction });
      }

      // Commit transaction
      await transaction.commit();
      return application;
    } catch (error) {
      // Rollback transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = ApplicationDAO;
