const express = require("express");
const AuthHandler = require("./auth/authorization");
const GenericAppError = require("../utils/genericAppError");
/**
 * RequestHandler class for handling Requests
 */
class RequestHandler {
  /**
   * Constructor for the RequestHandler
   * @param {string} basePath - The base path for the request
   */
  constructor(basePath, logger) {
    this.router = express.Router();
    this.basePath = basePath;
    this.auth = new AuthHandler();
    this.logger = logger;
  }

  /**
   * Registers the routes for the RequestHandler
   * Must be implemented by the subclass
   * @throws {Error} - If the method is not implemented
   */
  registerRoutes() {
    throw new Error("registerRoutes must be implemented");
  }

  /**
   * Sends a success response
   * @param {Response} res - The response object
   * @param {number} status - The status code
   * @param {Object} data - The data to be sent
   */
  sendSuccess(res, status, data) {
    res.status(status).json({
      success: true,
      data,
    });
  }

  /**
   * Logs a succssful request
   * @param {string} msg - The message to log 
   */
  logSuccess(msg){
    try {
      this.logger.log("info", msg);
    } catch (error) {
      throw GenericAppError.createInternalServerError("Logger failed", error)
    }
  }

  /**
   * Sends an error response
   * @param {Response} res - The response object
   *  @param {number} status - The status code
   *  @param {string} message - The error message
   */
  sendError(res, error) {
    if (error instanceof GenericAppError){
      res.status(error.status).json({success: false, error: error.userMessage});
    }
    else{
      res.status(500).json({success: false, error:"An unexpected error occurred. Please try again later."});
    }
  }
}

module.exports = RequestHandler;
