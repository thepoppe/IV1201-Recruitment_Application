require("dotenv").config();
const express = require("express");
const { syncDatabase } = require("./src/config/databaseConfig");; 

const app = express();
const port = 4000;




// Root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const startServer = async () =>{
  try {
    await syncDatabase();
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
  } 
  catch (error) {
          console.error("Server setup error:", error);
          process.exit(1);
      }
};
startServer();

