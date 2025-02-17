const express = require("express");
const RequestHandler = require("./requestHandler");
const Controller = require("../controller/controller");
const { validateCreateAccount } = require("../utils/personValidator");

class PersonApi extends RequestHandler {
  constructor() {
    super("/person");
    this.controller = new Controller();
  }

  registerRoutes() {
    // Create account route with validation middleware
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

    // Find all persons route
    this.router.get("/all", async (req, res) => {
      try {
        const persons = await this.controller.findAllPersons();
        this.sendSuccess(res, 200, persons);
      } catch (error) {
        this.sendError(res, 400, error.message);
      }
    });
  }
}

module.exports = PersonApi;
