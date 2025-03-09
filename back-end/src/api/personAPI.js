const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const {
  validateCreateAccount,
  validateLogin,
  validateGetUser,
} = require("../utils/personValidator");

/**
 * Person API class for handling Person requests
 */
class PersonApi extends RequestHandler {
  /**
   * Constructor for the Person API
   * Sets the base path and creates a new controller
   * @param {string} basePath - The base path for the request
   */
  constructor(logger) {
    super("/person", logger);
    this.controller = new Controller();
  }

  /**
   * Registers the routes for the Person API
   *
   * POST /person/create-account - Creates a new person
   * GET /person/all - Finds all persons
   */
  registerRoutes() {
    /**
     * async function that creates a new person
     * @param {Object} req - The request object
     * @param {Object} res - The response object

     * @param {Function} next - The next function
     */ 
    this.router.post(
      "/create-account",
      validateCreateAccount,
      async (req, res, next) => {
        try {
          const person = await this.controller.createPerson(req.body);
          this.logSuccess(`Successfully created a profile for user ${person.id}`);
          this.sendSuccess(res, 201, person);  
        } 
        catch (error) {
          next(error);
        }
      }
    );

    /**
     * async function to login a person
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next function
     */

    this.router.post("/login",
      validateLogin,
      async (req, res, next) => {
      try {
        const person = await this.controller.login(req.body);
        const response = this.auth.addTokenToResponse(person);
        this.logSuccess(`Successfully logged in person with id: ${person.id}`)
        this.sendSuccess(res, 200, response);
      } 
      catch (error) {
        next(error);
      }
    });

    /**
     * async function to get a persons data by id if authenticated and authorized
     * @param {Object} req - The request object
     * @param {Object} req.params.id -  The id of the requested person data
     * @param {Object} req.decoded - The decoded token if authentication is valid
     * @param {Object} res - The response object
     * @param {Function} next - The next function
     *
     */
    this.router.get(
      "/id/:id",
      validateGetUser,
      this.auth.authenticateUser,
      this.auth.authorizeRecruiter(this.controller),
      async (req, res, next) => {
        try {
          const person = await this.controller.getPersonData(req.params.id);
          this.logSuccess(`User ${req.decoded.id} successfully returned the profile for user ${person.id}`);
          this.sendSuccess(res, 200, person);
        } 
        catch (error) {
          next(error);
        }
      }
    );

    /**
     * async function to get the data of the authenticated person
     * it uses the token to get the id of the person, not sending the id in the request
     * @param {Object} req - The request object
     * @param {Object} req.decoded - The decoded token if authentication is valid
     * @param {Object} res - The response object
     * @param {Function} next - The next function
     */
    this.router.get(
      "/me",
      this.auth.authenticateUser,
      async (req, res, next) => {
        try {
          const person = await this.controller.getPersonData(req.decoded.id);
          this.logSuccess(`User ${req.decoded.id} successfully returned the profile for user ${person.id}`);
          this.sendSuccess(res, 200, person);
        } 
        catch (error) {
          next(error);
        }
      }
    );
  }
}
module.exports = PersonApi;
