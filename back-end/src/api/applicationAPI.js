const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const {
  validateApplyForJob,
  validateAddCompetence,
  validateAddAvailability,
} = require("../utils/applicationValidator");

class ApplicationAPI extends RequestHandler {
  constructor() {
    super("/application");
    this.controller = new Controller();
  }

  registerRoutes() {
    // Apply for a job
    this.router.post(
      "/apply",
      this.auth.authenticateUser.bind(this.auth),
      validateApplyForJob,
      async (req, res, next) => {
        try {
          const application = await this.controller.applyForJob(req.decoded.id);
          this.sendSuccess(res, 201, application);
        } catch (error) {
          next(error);
        }
      }
    );

    // Add competence
    this.router.post(
      "/add-competence",
      this.auth.authenticateUser.bind(this.auth),
      validateAddCompetence,
      async (req, res, next) => {
        try {
          const { competence_id, years_of_experience } = req.body;
          const result = await this.controller.addCompetenceToApplication(
            req.decoded.id,
            competence_id,
            years_of_experience
          );
          this.sendSuccess(res, 201, result);
        } catch (error) {
          next(error);
        }
      }
    );

    // Add availability
    this.router.post(
      "/add-availability",
      this.auth.authenticateUser.bind(this.auth),
      validateAddAvailability,
      async (req, res, next) => {
        try {
          const { from_date, to_date } = req.body;
          const result = await this.controller.addAvailabilityToApplication(
            req.decoded.id,
            from_date,
            to_date
          );
          this.sendSuccess(res, 201, result);
        } catch (error) {
          next(error);
        }
      }
    );

    // List all competences
    this.router.get(
      "/competences",
      this.auth.authenticateUser.bind(this.auth),
      async (req, res, next) => {
        try {
          const competences = await this.controller.listAllCompetences();
          this.sendSuccess(res, 200, competences);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

module.exports = ApplicationAPI;
