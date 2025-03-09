const Joi = require("joi");
const GenericAppError = require("./genericAppError")

const createAccountSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name must contain only letters",
    }),
  surname: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name must contain only letters",
    }),
  pnr: Joi.string()
    .required()
    .pattern(/^\d{8}-\d{4}$/)
    .messages({
      "string.empty": "Personal number is required",
      "string.pattern.base": "Personal number must be in format YYYYMMDD-XXXX",
    }),
  email: Joi.string().required().email({ tlds: false }).messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});
const loginSchema = Joi.object({
  email: Joi.string().required().email({ tlds: false }).messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
const getUserSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "ID must be a number",
    "number.empty": "ID is required",
  }),
});

const validateCreateAccount = (req, res, next) => {
  const { error } = createAccountSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return next(GenericAppError.createValidationError(`Validation error:${error.details.map(detail => detail.message)}`, error));
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return next(GenericAppError.createValidationError(`Validation error:${error.details.map(detail => detail.message)}`, error));
  }
  next();
};

const validateGetUser = (req, res, next) => {
  const { error } = getUserSchema.validate(req.params, { abortEarly: true });
  if (error) {
    return next(GenericAppError.createValidationError(`Validation error:${error.details.map(detail => detail.message)}`, error));
  }
  next();
};

module.exports = {
  validateCreateAccount,
  validateLogin,
  validateGetUser,
};