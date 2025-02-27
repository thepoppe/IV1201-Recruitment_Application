const BaseDAO = require("./baseDAO");
const Availability = require("../models/availabilityModel");

class AvailabilityDAO extends BaseDAO {
  constructor() {
    super(Availability);
  }

  async findAvailability(person_id, from_date, to_date) {
    return await this.model.findOne({
      where: { person_id, from_date, to_date },
    });
  }

  async addAvailability(person_id, from_date, to_date) {
    return await this.model.create({ person_id, from_date, to_date });
  }
}

module.exports = AvailabilityDAO;
