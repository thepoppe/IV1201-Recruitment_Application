const express = require("express");
const RequestHandler = require("./requestHandler");
const PersonController = require("../controller/personController");
const { validateCreateAccount } = require("../utils/personValidator");

class PersonApi extends RequestHandler {
  constructor() {
    super("/api/person");
    this.controller = new PersonController();
  }

  registerRoutes() {
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
  }
}

module.exports = PersonApi;
