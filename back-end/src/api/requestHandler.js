const express = require("express");

class RequestHandler {
  constructor(basePath) {
    this.router = express.Router();
    this.basePath = basePath;
  }

  registerRoutes() {
    throw new Error("registerRoutes must be implemented");
  }

  sendSuccess(res, status, data) {
    res.status(status).json({
      success: true,
      data,
    });
  }

  sendError(res, status, message) {
    res.status(status).json({
      success: false,
      error: message,
    });
  }
}

module.exports = RequestHandler;
