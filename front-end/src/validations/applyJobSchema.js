import Joi from "joi";

export const applyJobSchema = (dict) =>
  Joi.object({}).messages({
    "object.base": dict.applyJob.validation.invalid,
  });
