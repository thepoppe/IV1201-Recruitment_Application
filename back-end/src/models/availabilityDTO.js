/**
 * DTO for Availability response
 */
class AvailabilityDTO {
  constructor(availability) {
    this.from_date = availability.from_date;
    this.to_date = availability.to_date;
  }
}

module.exports = AvailabilityDTO;
