require("dotenv").config();
const { syncDatabase } = require("./src/config/databaseConfig");
const App = require("./src/app");


// Start server
const startServer = async () => {
  try {
    await syncDatabase();
    const app = new App(4000);
    app.start();
  } catch (error) {
    console.error("Server setup error:", error);
    process.exit(1);
  }
};
startServer();