const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const { validateApplyForJob } = require("../utils/applicationValidator");

class ApplicationAPI extends RequestHandler {
  constructor() {
    super("/application");
    this.controller = new Controller();
  }

  registerRoutes() {
    // Apply for a job (now with competences & availability)
    this.router.post(
      "/apply",
      this.auth.authenticateUser.bind(this.auth),
      validateApplyForJob,
      async (req, res, next) => {
        try {
          const { competences, availabilities } = req.body;
          const application = await this.controller.applyForJob(
            req.decoded.id,
            competences,
            availabilities
          );
          this.sendSuccess(res, 201, application);
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
