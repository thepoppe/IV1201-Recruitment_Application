"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { createAccountSchema } from "@/validations/createAccountSchema";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import Button from "@/components/ui/Button";

/**
 * CreateAccount component handles user registration functionality.
 * 
 * This client-side component provides a form for users to create a new account.
 * It handles form validation, submission, error handling, and automatic login
 * upon successful account creation.
 * 
 * @component
 * @returns {JSX.Element} The rendered CreateAccount form component
 */
export default function CreateAccount() {
  const { dict } = useLanguage(); // Get translations
  const { login } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState(null);

  /**
   * Form handling configuration using react-hook-form
   * @const {Object} register - Method to register form inputs
   * @const {Function} handleSubmit - Form submission handler
   * @const {Object} errors - Contains validation errors
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(createAccountSchema(dict)),
    mode: "onBlur",
  });

  /**
   * Handles form submission to create a new user account.
   *
   * @async
   * @function onSubmit
   * @param {Object} data - Form data containing user registration information
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's chosen password
   * @param {string} data.firstName - User's first name (if applicable)
   * @param {string} data.lastName - User's last name (if applicable)
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      setLoginCredentials(data);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/create-account`,
        data
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || dict.create_account.error.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Effect hook to automatically log in user after successful account creation.
   *
   * @effect
   * @dependency {boolean} success - Triggers when account creation is successful
   */
  useEffect(() => {
    if (success) {
      login(loginCredentials.email, loginCredentials.password);
    }
  }, [success]);

  // Reusable classnames to reduce repetition
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const getInputClass = (error) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
      error ? "border-red-500" : "border-gray-300"
    }`;
  const errorClass = "mt-1 text-sm text-red-600";

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
          <label htmlFor="name" className={labelClass}>
            {dict.create_account.fields.first_name}
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder={dict.create_account.placeholders.first_name}
            disabled={isSubmitting}
            className={getInputClass(errors.name)}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="surname" className={labelClass}>
            {dict.create_account.fields.last_name}
          </label>
          <input
            id="surname"
            {...register("surname")}
            type="text"
            placeholder={dict.create_account.placeholders.last_name}
            disabled={isSubmitting}
            className={getInputClass(errors.surname)}
          />
          {errors.surname && (
            <p className={errorClass}>{errors.surname.message}</p>
          )}
        </div>

        {/* Personal Number */}
        <div>
          <label htmlFor="pnr" className={labelClass}>
            {dict.create_account.fields.personal_number}
          </label>
          <input
            id="pnr"
            {...register("pnr")}
            type="text"
            placeholder={dict.create_account.placeholders.personal_number}
            disabled={isSubmitting}
            className={getInputClass(errors.pnr)}
          />
          {errors.pnr && <p className={errorClass}>{errors.pnr.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            {dict.create_account.fields.email}
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder={dict.create_account.placeholders.email}
            disabled={isSubmitting}
            className={getInputClass(errors.email)}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelClass}>
            {dict.create_account.fields.password}
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            placeholder={dict.create_account.placeholders.password}
            disabled={isSubmitting}
            className={getInputClass(errors.password)}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          className="w-full font-medium"
        >
          {isSubmitting
            ? dict.create_account.button.loading
            : dict.create_account.button.submit}
        </Button>
      </form>
    </div>
  );
}
