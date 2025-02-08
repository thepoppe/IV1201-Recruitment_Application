/**
 * start up the application
 */


// require sequlize
// require JWT
// require routes
// require json
const express = require("express");
const personAPI = require("./api/personAPI");

class App {
    constructor(port) {
        this.app = express();
        this.port = port;
        this.initmiddleware();
        this.initRoutes();
        this.initErrorHandling();
    }

    initmiddleware() {
        this.app.use(express.json());
    }

    initRoutes() {
        this.app.use("/api/person", personAPI);

        // Root endpoint
        this.app.get("/", (req, res) => {
            res.send("Backend is running!");
        });
    }

    initErrorHandling() {
    
    }


    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}



module.exports = App;