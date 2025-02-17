const PersonApi = require("./personAPI");

class ApiLoader {
  constructor() {
    this.apis = [new PersonApi()];
  }

  async loadApis(app) {
    this.apis.forEach((api) => {
      api.registerRoutes();
      app.use(`/api${api.basePath}`, api.router);
    });
  }
}

module.exports = ApiLoader;
