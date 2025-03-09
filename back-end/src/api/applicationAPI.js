const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const { validateApplyForJob, validateUpdateStatus } = require("../utils/applicationValidator");

class ApplicationAPI extends RequestHandler {
  constructor(logger) {
    super("/application", logger);
    this.controller = new Controller();
  }

  registerRoutes() {
    /**
     * @route POST /application/apply
     * @description Apply for a job with competences and availability
     * @access Private - Requires user authentication
     * @param {Object} req.body.competences - List of applicant competences
     * @param {Object} req.body.availabilities - Applicant availability periods
     * @returns {Object} 201 - Application object
     * @throws {Error} When application creation fails
     */
    this.router.post(
      "/apply",
      this.auth.authenticateUser,
      validateApplyForJob,
      async (req, res, next) => {
        try {
          const { competences, availabilities } = req.body;
          const application = await this.controller.applyForJob(
            req.decoded.id,
            competences,
            availabilities
          );
          this.logSuccess(`User ${req.decoded.id} successfully created an application`);
          this.sendSuccess(res, 201, application);
        } catch (error) {
          
          next(error);
        }
      }
    );

    /**
     * @route GET /application/competences
     * @description List all available competences
     * @access Private - Requires user authentication
     * @returns {Array} 200 - Array of competence objects
     * @throws {Error} When fetching competences fails
     */
    this.router.get(
      "/competences",
      this.auth.authenticateUser,
      async (req, res, next) => {
        try {
          const competences = await this.controller.listAllCompetences();
          this.logSuccess(`User ${req.decoded.id} successfully retrieved the competences`);
          this.sendSuccess(res, 200, competences);
        } catch (error) {
          next(error);
        }
      }
    );

    /**
     * @route GET /application/my-application
     * @description Get the current user's application
     * @access Private - Requires user authentication
     * @returns {Object} 200 - User's application object
     * @throws {Error} When fetching application fails
     */
    this.router.get(
      "/my-application",
      this.auth.authenticateUser,
      async (req, res, next) => {
        try {
          const application = await this.controller.getUserApplication(
            req.decoded.id
          );
          this.logSuccess(`User ${req.decoded.id} successfully retrieved their application`);
          this.sendSuccess(res, 200, application);
        } catch (error) {
          next(error);
        }
      }
    );

    /**
     * @route GET /application/all
     * @description Fetch all applications in the system
     * @access Private - Requires recruiter role
     * @returns {Array} 200 - Array of application objects
     * @throws {Error} When fetching applications fails
     */
    this.router.get(
      "/all",
      this.auth.authenticateUser,
      this.auth.authorizeRecruiter(this.controller), // Only recruiters can access
      async (req, res, next) => {
        try {
          const applications = await this.controller.getAllApplications();
          this.logSuccess(`User ${req.decoded.id} successfully retrieved all applications`);
          this.sendSuccess(res, 200, applications);
        } catch (error) {
          next(error);
        }
      }
    );

    /**
     * @route GET /application/:id
     * @description Fetch a single application by ID
     * @access Private - Requires recruiter role
     * @param {string} req.params.id - Application ID
     * @returns {Object} 200 - Application object
     * @throws {Error} When application is not found or fetch fails
     */
    this.router.get(
      "/:id",
      this.auth.authenticateUser,
      this.auth.authorizeRecruiter(this.controller), // Restrict to recruiters
      async (req, res, next) => {
        try {
          const application = await this.controller.getApplicationById(req.params.id);
          this.logSuccess(`User ${req.decoded.id} successfully retrieved application: ${req.params.id}`);
          this.sendSuccess(res, 200, application);
        } catch (error) {
          next(error);
        }
      }
    );

    /**
     * @route PATCH /application/:id/status
     * @description Update application status
     * @access Private - Requires recruiter role
     * @param {string} req.params.id - Application ID
     * @param {string} req.body.status - New application status
     * @returns {Object} 200 - Updated application object
     * @throws {Error} When status update fails
     */
    this.router.patch(
      "/:id/status",
      validateUpdateStatus,
      this.auth.authenticateUser,
      this.auth.authorizeRecruiter(this.controller), // Restrict to recruiters
      async (req, res, next) => {
        try {
          const { status } = req.body;
          const updatedApplication = await this.controller.updateApplicationStatus(req.params.id, status);
          this.logSuccess(`User ${req.decoded.id} successfully update the status of application:${req.params.id} to ${status}`);
          this.sendSuccess(res, 200, updatedApplication);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

module.exports = ApplicationAPI;
