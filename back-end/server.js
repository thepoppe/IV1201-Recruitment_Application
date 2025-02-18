const express = require("express");
const cors = require("cors");
const ApiLoader = require("./src/api/apiLoader");
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
    this.setupMiddleware();
  }

  /**
   * Setup middleware for the Express app
   * - Parse JSON bodies
   * - Enable CORS
   */
  setupMiddleware() {
    this.app.use(express.json());

    // Enable CORS for requests from "http://localhost:3000"
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
      })
    );
  }

  /**
   * Start the server
   * @param {number} port - The port to listen on
   */
  async start(port = 4000) {
    await db.init();
    const apiLoader = new ApiLoader();
    await apiLoader.loadApis(this.app);

    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

const server = new Server();
server.start();
