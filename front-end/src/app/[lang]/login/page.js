"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLanguage } from "@/contexts/LanguageContext";
import { loginSchema } from "@/validations/loginSchema";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const { login, loading, error } = useUser();
  const { dict } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema(dict)),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

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
            disabled={loading}
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
            disabled={loading}
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
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {loading ? dict.login.button.loading : dict.login.button.submit}
        </button>
      </form>
    </div>
  );
}
