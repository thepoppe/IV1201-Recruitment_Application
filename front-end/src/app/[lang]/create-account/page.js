"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { createAccountSchema } from "@/validations/createAccountSchema";
import { useState } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateAccount() {
  const { dict } = useLanguage(); // Get translations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createAccountSchema(dict)),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/person/create-account`,
        data
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || dict.create_account.error.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {dict.create_account.success.title}
        </h2>
        <p className="text-gray-600">{dict.create_account.success.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-2xl bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {dict.create_account.title}
        </h1>
        <p className="text-center text-gray-600 mt-2">
          {dict.create_account.subtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.create_account.fields.first_name}
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder={dict.create_account.placeholders.first_name}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.create_account.fields.last_name}
          </label>
          <input
            id="surname"
            {...register("surname")}
            type="text"
            placeholder={dict.create_account.placeholders.last_name}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.surname ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.surname && (
            <p className="mt-1 text-sm text-red-600">
              {errors.surname.message}
            </p>
          )}
        </div>

        {/* Personal Number */}
        <div>
          <label
            htmlFor="pnr"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.create_account.fields.personal_number}
          </label>
          <input
            id="pnr"
            {...register("pnr")}
            type="text"
            placeholder={dict.create_account.placeholders.personal_number}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.pnr ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.pnr && (
            <p className="mt-1 text-sm text-red-600">{errors.pnr.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {dict.create_account.fields.email}
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder={dict.create_account.placeholders.email}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
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
            {dict.create_account.fields.password}
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            placeholder={dict.create_account.placeholders.password}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? dict.create_account.button.loading
            : dict.create_account.button.submit}
        </button>
      </form>
    </div>
  );
}
