const Joi = require("joi");
const GenericAppError = require("../utils/genericAppError");

// Schema for applying for a job (no input required)
const applyForJobSchema = Joi.object({});

// Schema for adding competence
const addCompetenceSchema = Joi.object({
  competence_id: Joi.number().integer().required().messages({
    "number.base": "Competence ID must be a number",
    "number.empty": "Competence ID is required",
  }),
  years_of_experience: Joi.number().min(0).max(50).required().messages({
    "number.base": "Years of experience must be a number",
    "number.min": "Years of experience cannot be negative",
    "number.max": "Years of experience cannot exceed 50 years",
    "number.empty": "Years of experience is required",
  }),
});

// Schema for adding availability
const addAvailabilitySchema = Joi.object({
  from_date: Joi.date().required().messages({
    "date.base": "From date must be a valid date",
    "date.empty": "From date is required",
  }),
  to_date: Joi.date().greater(Joi.ref("from_date")).required().messages({
    "date.base": "To date must be a valid date",
    "date.empty": "To date is required",
    "date.greater": "To date must be later than From date",
  }),
});

// Middleware validation functions
const validateApplyForJob = (req, res, next) => {
  const { error } = applyForJobSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return next(
      GenericAppError.createValidationError(
        `Validation error: ${error.details.map((detail) => detail.message)}`,
        error
      )
    );
  }
  next();
};

const validateAddCompetence = (req, res, next) => {
  const { error } = addCompetenceSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return next(
      GenericAppError.createValidationError(
        `Validation error: ${error.details.map((detail) => detail.message)}`,
        error
      )
    );
  }
  next();
};

const validateAddAvailability = (req, res, next) => {
  const { error } = addAvailabilitySchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return next(
      GenericAppError.createValidationError(
        `Validation error: ${error.details.map((detail) => detail.message)}`,
        error
      )
    );
  }
  next();
};

module.exports = {
  validateApplyForJob,
  validateAddCompetence,
  validateAddAvailability,
};
