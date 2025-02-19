const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const { validateCreateAccount, validateLogin, validateGetUser} = require("../utils/personValidator");

/**
 * Person API class for handling Person requests
 */
class PersonApi extends RequestHandler {
  /**
   * Constructor for the Person API
   * Sets the base path and creates a new controller
   * @param {string} basePath - The base path for the request
   */
  constructor() {
    super("/person");
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
     */ 
    this.router.post(
      "/create-account",
      validateCreateAccount,
      async (req, res) => {
        try {
          const person = await this.controller.createPerson(req.body);
          this.sendSuccess(res, 201, person);  
        } catch (error) {
          this.sendError(res, 400, error.message);
        }
      }
    );

    /**
     * async function that finds all persons
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */
    this.router.get("/all", async (req, res) => {
      try { 
        const persons = await this.controller.findAllPersons();
        this.sendSuccess(res, 200, persons);
      } catch (error) {
        this.sendError(res, 400, error.message);
      }
    });


    /**
     * async function to login a person
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */
    this.router.post("/login",
      validateLogin,
      async (req, res) => {
      try {
        const person = await this.controller.login(req.body);
        const response = this.auth.addTokenToResponse(person);
        this.sendSuccess(res, 200, response);
      } catch (error) {
        this.sendError(res, 400, error.message);
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
    this.router.get("/id/:id", 
      validateGetUser,
      this.auth.authenticateUser.bind(this.auth),
      this.auth.authorizePersonRequest(this.controller),
      async (req, res) => {
      try {
        const person = await this.controller.getPersonData(req.params.id);
        this.sendSuccess(res, 200, person);
      } catch (error) {
        this.sendError(res, 400, error.message);
      }
    });
  }
}
module.exports = PersonApi;
