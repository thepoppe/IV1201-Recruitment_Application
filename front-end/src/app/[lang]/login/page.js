"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLanguage } from "@/contexts/LanguageContext";
import { loginSchema } from "@/validations/loginSchema";
import { useUser } from "@/contexts/UserContext";
import Button from "@/components/ui/Button";

/**
 * LoginPage component handles user authentication.
 *
 * This client-side component provides a form for users to log in to their account.
 * It handles form validation, submission, and error handling using react-hook-form
 * and Joi validation.
 *
 * @component
 * @returns {JSX.Element} The rendered Login form component
 */
export default function LoginPage() {
  const { login, loading, error } = useUser();
  const { dict } = useLanguage();

  /**
   * Form handling configuration using react-hook-form with Joi validation
   * @const {Object} register - Method to register form inputs
   * @const {Function} handleSubmit - Form submission handler
   * @const {Object} errors - Contains validation errors
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema(dict)),
    mode: "onBlur",
  });

  /**
   * Handles form submission for user login
   *
   * @async
   * @function onSubmit
   * @param {Object} data - Form data containing login credentials
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

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
          {dict.login.title}
        </h1>
        <p className="text-center text-gray-600 mt-2">{dict.login.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className={errorClass}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            {dict.login.fields.email}
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder={dict.login.placeholders.email}
            disabled={loading}
            className={getInputClass(errors.email)}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelClass}>
            {dict.login.fields.password}
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            placeholder={dict.login.placeholders.password}
            disabled={loading}
            className={getInputClass(errors.password)}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full font-medium"
        >
          {loading ? dict.login.button.loading : dict.login.button.submit}
        </Button>
      </form>
    </div>
  );
}
