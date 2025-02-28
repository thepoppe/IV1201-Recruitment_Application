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

    // Get user application for the authenticated user
    this.router.get(
      "/my-application",
      this.auth.authenticateUser.bind(this.auth),
      async (req, res, next) => {
        try {
          const application = await this.controller.getUserApplication(
            req.decoded.id
          );
          this.sendSuccess(res, 200, application);
        } catch (error) {
          next(error);
        }
      }
    );

    // Fetch all applications (Recruiter only)
    this.router.get(
      "/all",
      this.auth.authenticateUser.bind(this.auth),
      this.auth.authorizeRecruiter(this.controller), // Only recruiters can access
      async (req, res, next) => {
        try {
          const applications = await this.controller.getAllApplications();
          this.sendSuccess(res, 200, applications);
        } catch (error) {
          next(error);
        }
      }
    );

    // Fetch a single application by ID (Recruiter only)
    this.router.get(
      "/:id",
      this.auth.authenticateUser.bind(this.auth),
      this.auth.authorizeRecruiter(this.controller), // Restrict to recruiters
      async (req, res, next) => {
        try {
          const application = await this.controller.getApplicationById(req.params.id);
          if (!application) {
            return next(GenericAppError.createNotFoundError("Application not found"));
          }
          this.sendSuccess(res, 200, application);
        } catch (error) {
          next(error);
        }
      }
    );

    // Update application status (Recruiter only)
    this.router.patch(
      "/:id/status",
      this.auth.authenticateUser.bind(this.auth),
      this.auth.authorizeRecruiter(this.controller), // Restrict to recruiters
      async (req, res, next) => {
        try {
          const { status } = req.body;
          if (!["accepted", "rejected"].includes(status)) {
            return next(GenericAppError.createBadRequestError("Invalid status"));
          }

          const updatedApplication = await this.controller.updateApplicationStatus(req.params.id, status);
          this.sendSuccess(res, 200, updatedApplication);
        } catch (error) {
          next(error);
        }
      }
    );



  }
}

module.exports = ApplicationAPI;
