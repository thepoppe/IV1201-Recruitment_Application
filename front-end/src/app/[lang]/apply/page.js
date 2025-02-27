"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { applyJobSchema } from "@/validations/applyJobSchema";
import axios from "axios";
import { useState } from "react";

export default function ApplyJobPage() {
  const { dict } = useLanguage();
  const { token } = useUser(); // Get JWT token from user context
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { handleSubmit } = useForm({
    resolver: joiResolver(applyJobSchema(dict)),
    mode: "onBlur",
  });

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "/api/application/apply",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(dict.applyJob.success);
    } catch (err) {
      console.log(err.response?.data?.error);
      setError(err.response?.data?.error || dict.applyJob.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {dict.applyJob.title}
        </h1>
        <p className="text-center text-gray-600 mt-2">
          {dict.applyJob.subtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
