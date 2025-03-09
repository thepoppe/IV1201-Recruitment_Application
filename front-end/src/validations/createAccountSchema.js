import Joi from "joi";

/**
 * Creates a Joi validation schema for user account creation.
 * 
 * This function generates a Joi validation schema for validating user registration data.
 * The schema enforces validation rules for name, surname, personal number (pnr),
 * email, and password with localized error messages from the provided dictionary.
 * 
 *   The schema validates:
 * - name: Required string between 2-50 characters
 * - surname: Required string between 2-50 characters
 * - pnr: Required string in format "YYYYMMDD-XXXX" 
 * - email: Required valid email address
 * - password: Required string with at least 8 characters, containing at least 
 *   one lowercase letter, one uppercase letter, and one digit
 * 
 * @function createAccountSchema
 * @param {Object} dict - Dictionary object containing localized validation messages
 * @returns {Joi.ObjectSchema} A Joi schema for validating account creation data
 */
export const createAccountSchema = (dict) =>
  Joi.object({
    name: Joi.string().required().min(2).max(50).pattern(/^[a-zA-Z]+$/).messages({
      "string.empty": dict.createAccountValidation.name.required,
      "string.min": dict.createAccountValidation.name.min,
      "string.max": dict.createAccountValidation.name.max,
      "string.pattern.base": dict.createAccountValidation.name.pattern,
    }),
    surname: Joi.string().required().min(2).max(50).pattern(/^[a-zA-Z]+$/).messages({
      "string.empty": dict.createAccountValidation.surname.required,
      "string.min": dict.createAccountValidation.surname.min,
      "string.max": dict.createAccountValidation.surname.max,
      "string.pattern.base": dict.createAccountValidation.surname.pattern,
    }),
    pnr: Joi.string()
      .required()
      .pattern(/^\d{8}-\d{4}$/)
      .messages({
        "string.empty": dict.createAccountValidation.pnr.required,
        "string.pattern.base": dict.createAccountValidation.pnr.pattern,
      }),
    email: Joi.string().required().email({ tlds: false }).messages({
      "string.empty": dict.createAccountValidation.email.required,
      "string.email": dict.createAccountValidation.email.invalid,
    }),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        "string.empty": dict.createAccountValidation.password.required,
        "string.min": dict.createAccountValidation.password.min,
        "string.pattern.base": dict.createAccountValidation.password.pattern,
      }),
  });
