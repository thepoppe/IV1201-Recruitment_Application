import Joi from "joi";

/**
 * Creates a Joi validation schema for user login.
 * 
 * This function generates a Joi validation schema for validating user login credentials.
 * The schema enforces validation rules for email and password with localized error
 * messages from the provided dictionary.
 * 
 *   The schema validates:
 * - email: Required valid email address
 * - password: Required string with at least 8 characters
 * 
 * @function loginSchema
 * @param {Object} dict - Dictionary object containing localized validation messages
 * @returns {Joi.ObjectSchema} A Joi schema for validating login credentials
 */
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
