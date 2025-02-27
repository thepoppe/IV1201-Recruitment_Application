"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { applyJobSchema } from "@/validations/applyJobSchema";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ApplyJobPage() {
  const { dict } = useLanguage();
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [competences, setCompetences] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(applyJobSchema(dict)),
    mode: "onBlur",
    defaultValues: {
      competences: [{ competence_id: "", years_of_experience: "" }],
      availabilities: [{ from_date: "", to_date: "" }],
    },
  });

  const {
    fields: competenceFields,
    append: addCompetence,
    remove: removeCompetence,
  } = useFieldArray({ control, name: "competences" });
  const {
    fields: availabilityFields,
    append: addAvailability,
    remove: removeAvailability,
  } = useFieldArray({ control, name: "availabilities" });

  // Fetch competences from API
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/application/competences`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompetences(response.data.data);
      } catch (err) {
        console.error("Failed to fetch competences:", err);
      }
    };
    fetchCompetences();
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/application/apply`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(dict.applyJob.success);
    } catch (err) {
      setError(err.response?.data?.error || dict.applyJob.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center text-gray-900">
        {dict.applyJob.title}
      </h1>
      <p className="text-center text-gray-600 mt-2">{dict.applyJob.subtitle}</p>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {/* Competences Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            {dict.applyJob.fields.competences}
          </h2>
          {competenceFields.map((item, index) => (
            <div key={item.id} className="flex space-x-4 mt-3">
              {/* Competence Selection */}
              <select
                {...register(`competences.${index}.competence_id`)}
                className="w-1/2 px-4 py-2 border rounded-md"
              >
                <option value="">
                  {dict.applyJob.placeholders.select_competence}
                </option>
                {competences.map((comp) => (
                  <option key={comp.competence_id} value={comp.competence_id}>
                    {comp.name}
                  </option>
                ))}
              </select>
              {/* Years of Experience */}
              <input
                type="number"
                {...register(`competences.${index}.years_of_experience`)}
                placeholder={dict.applyJob.placeholders.years_experience}
                className="w-1/4 px-4 py-2 border rounded-md"
              />
              {/* Remove Competence Button */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeCompetence(index)}
                  className="text-red-600 text-sm"
                >
                  {dict.applyJob.buttons.remove}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addCompetence({ competence_id: "", years_of_experience: "" })
            }
            className="mt-3 text-blue-600"
          >
            {dict.applyJob.buttons.add_competence}
          </button>
        </div>

        {/* Availability Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            {dict.applyJob.fields.availability}
          </h2>
          {availabilityFields.map((item, index) => (
            <div key={item.id} className="flex space-x-4 mt-3">
              {/* From Date */}
              <input
                type="date"
                {...register(`availabilities.${index}.from_date`)}
                className="w-1/2 px-4 py-2 border rounded-md"
              />
              {/* To Date */}
              <input
                type="date"
                {...register(`availabilities.${index}.to_date`)}
                className="w-1/2 px-4 py-2 border rounded-md"
              />
              {/* Remove Availability Button */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="text-red-600 text-sm"
                >
                  {dict.applyJob.buttons.remove}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addAvailability({ from_date: "", to_date: "" })}
            className="mt-3 text-blue-600"
          >
            {dict.applyJob.buttons.add_availability}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {loading ? dict.applyJob.button.loading : dict.applyJob.button.submit}
        </button>
      </form>
    </div>
  );
}
