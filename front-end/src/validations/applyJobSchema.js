import Joi from "joi";

export const applyJobSchema = (dict) =>
  Joi.object({
    competences: Joi.array()
      .items(
        Joi.object({
          competence_id: Joi.number().integer().required().messages({
            "number.base": dict.applyJob.validation.competence_id,
            "number.empty": dict.applyJob.validation.competence_required,
          }),
          years_of_experience: Joi.number().min(0).max(50).required().messages({
            "number.base": dict.applyJob.validation.years_experience,
            "number.min": dict.applyJob.validation.years_experience_min,
            "number.max": dict.applyJob.validation.years_experience_max,
          }),
        })
      )
      .min(1)
      .required(),

    availabilities: Joi.array()
      .items(
        Joi.object({
          from_date: Joi.date().required().messages({
            "date.base": dict.applyJob.validation.from_date,
            "date.empty": dict.applyJob.validation.from_date_required,
          }),
          to_date: Joi.date()
            .greater(Joi.ref("from_date"))
            .required()
            .messages({
              "date.base": dict.applyJob.validation.to_date,
              "date.empty": dict.applyJob.validation.to_date_required,
              "date.greater": dict.applyJob.validation.to_date_greater,
            }),
        })
      )
      .min(1)
      .required(),
  });
