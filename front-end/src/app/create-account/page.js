"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),
  surname: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  pnr: Joi.string()
    .required()
    .pattern(/^\d{8}-\d{4}$/)
    .messages({
      "string.empty": "Personal number is required",
      "string.pattern.base": "Personal number must be in format YYYYMMDD-XXXX",
    }),
  email: Joi.string().required().email({ tlds: false }).messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Join our team at the Amusement Park
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder="John"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="surname"
            {...register("surname")}
            type="text"
            placeholder="Doe"
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

        <div>
          <label
            htmlFor="pnr"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Personal Number
          </label>
          <input
            id="pnr"
            {...register("pnr")}
            type="text"
            placeholder="YYYYMMDD-XXXX"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.pnr ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.pnr && (
            <p className="mt-1 text-sm text-red-600">{errors.pnr.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder="john.doe@example.com"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            placeholder="••••••••"
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
