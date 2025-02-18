const PersonApi = require("./personAPI");

/**
 * ApiLoader class for loading APIs
 */
class ApiLoader {
  /**
   * Constructor for the ApiLoader
   * Creates a new array of APIs
   */
  constructor() {
    this.apis = [new PersonApi()];
  }

  /**
   * Loads the APIs into the app
   * @param {Object} app - The express app
   */
  async loadApis(app) {
    this.apis.forEach((api) => {
      api.registerRoutes();
      app.use(`/api${api.basePath}`, api.router);
    });
  }
}

module.exports = ApiLoader;
