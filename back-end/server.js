const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const ApiLoader = require("./src/api/apiLoader");
const ErrorHandler = require("./src/api/errorHandler/errorHandler");
const Logger = require("./src/utils/logger");
const HttpLogger = require("./src/api/httpLogger/httpLogger");
const db = require("./src/config/database");

/**
 * Server class to setup the Express server
 */
class Server {
  /**
   * Constructor to initialize the Express app
   */
  constructor() {
    this.app = express();
    this.server = null;
    this.logger = new Logger();
    this.httpLogger = new HttpLogger(this.logger);
    this.apiLoader = new ApiLoader(this.logger);
    this.errorHandler = new ErrorHandler(this.logger);
    this.setupMiddleware();
  }

  /**
   * Setup middleware for the Express app
   * - Parse JSON bodies
   * - Enable CORS
   *
   */
  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "https://recruit-web-staging-f49d79e1168e.herokuapp.com",
          "https://recruit-web-prod-9edf25da5b44.herokuapp.com",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests, please try again after 15 minutes",
    }))
    this.app.use(this.httpLogger.logHttpRequest);
  }

  /**
   * Start the server
   * @param {number} port - The port to listen on
   */
  async start(port = process.env.PORT || 4000) {
    await db.init();
    await this.apiLoader.loadApis(this.app);

    this.app.use(this.errorHandler.handleError);

    this.server = this.app.listen(port, () => {
      this.logger.log("info", `Server running on port ${port}`);
    });
  }

  /**
   * Close the server
   */
  async close() {
    if (this.server) {
      this.server.close(() => {
        this.logger.log("info", "Server closed");
      });
    }
  }
}

const server = new Server();
server.start();

module.exports = server;