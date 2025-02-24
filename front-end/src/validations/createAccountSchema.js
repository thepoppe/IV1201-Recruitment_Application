import Joi from "joi";

export const createAccountSchema = (dict) =>
  Joi.object({
    name: Joi.string().required().min(2).max(50).messages({
      "string.empty": dict.createAccountValidation.name.required,
      "string.min": dict.createAccountValidation.name.min,
      "string.max": dict.createAccountValidation.name.max,
    }),
    surname: Joi.string().required().min(2).max(50).messages({
      "string.empty": dict.createAccountValidation.surname.required,
      "string.min": dict.createAccountValidation.surname.min,
      "string.max": dict.createAccountValidation.surname.max,
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
