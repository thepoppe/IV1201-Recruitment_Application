import Joi from "joi";

/**
 * Creates a Joi validation schema for job applications.
 * 
 * This function generates a Joi validation schema for validating job application data.
 * The schema enforces validation rules for competences and availability periods,
 * with localized error messages based on the provided dictionary.
 * 
 * The schema validates:
 * - Competences: Array of objects with competence_id and years_of_experience
 *   - competence_id: Required integer
 *   - years_of_experience: Required number between 0 and 50
 * - Availabilities: Array of objects with from_date and to_date
 *   - from_date: Required valid date
 *   - to_date: Required valid date that must be after from_date
 * 
 * @function applyJobSchema
 * @param {Object} dict - Dictionary object containing localized validation messages
 * @returns {Joi.ObjectSchema} A Joi schema for validating job application data
 */
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
