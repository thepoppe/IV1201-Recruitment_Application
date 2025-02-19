"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { loginSchema } from "@/validations/loginSchema";

export default function LoginPage() {
  const { dict, lang } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema(dict)),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/person/login`,
        data
      );

      if (response.status === 200) {
        // Console log the response for demonstration
        console.log("Logged in successfully", response.data);
        // Redirect to home page after login (it is just for demonstration)
        router.push(`/${lang}/`);
      }
    } catch (err) {
      setError(err.response?.data?.error || dict.login.error.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {dict.login.title}
        </h1>
        <p className="text-center text-gray-600 mt-2">{dict.login.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.login.fields.email}
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder={dict.login.placeholders.email}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.login.fields.password}
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            placeholder={dict.login.placeholders.password}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md transition ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {isSubmitting ? dict.login.button.loading : dict.login.button.submit}
        </button>
      </form>
    </div>
  );
}
