import Joi from "joi";

// Validation schema for login form
export const loginSchema = (dict) =>
  Joi.object({
    email: Joi.string().required().email({ tlds: false }).messages({
      "string.empty": dict.loginValidation.email.required,
      "string.email": dict.loginValidation.email.invalid,
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": dict.loginValidation.password.required,
      "string.min": dict.loginValidation.password.min,
    }),
  });
