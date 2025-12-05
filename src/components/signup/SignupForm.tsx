"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocalizedNavigation } from "../../utils/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { EmailField, PasswordField } from "../forms/FormField";
import FormField from "../forms/FormField";
import ValidatedForm from "../forms/ValidatedForm";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: string;
  general?: string;
}

interface SignupFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: FormErrors;
  setErrors: (field: string, error: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignupForm({
  formData,
  setFormData,
  errors,
  setErrors,
  isLoading,
  onSubmit,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { navigate } = useLocalizedNavigation();
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(name, "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create Your Account
      </h2>

      {errors.general && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 flex items-center space-x-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          <span>{errors.general}</span>
        </motion.div>
      )}

      <ValidatedForm
        onSubmit={handleSubmit}
        validation={{
          data: formData,
          errors: errors as { [key: string]: string },
          isValid: Object.keys(errors).length === 0,
          setData: setFormData,
          setField: () => {},
          setError: (field: string, error: string) => setErrors(field, error),
          clearError: () => {},
          clearAllErrors: () => {},
          validate: () => ({ isValid: true, errors: {} }),
          validateField: () => null,
          reset: () => {},
          handleChange: handleInputChange,
          handleBlur: () => {},
        }}
        showGeneralError={true}
        generalError={errors.general}
        loading={isLoading}
        className="space-y-6"
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            placeholder="Enter your first name"
            required
            inputClassName="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />

          <FormField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            placeholder="Enter your last name"
            required
            inputClassName="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Email Field */}
        <EmailField
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="Enter your email address"
          required
          inputClassName="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        />

        {/* Password Field */}
        <PasswordField
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder="Create a strong password"
          required
          inputType={showPassword ? "text" : "password"}
          rightIcon={
            showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )
          }
          onRightIconClick={() => setShowPassword(!showPassword)}
          inputClassName="px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        />

        {/* Confirm Password Field */}
        <PasswordField
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
          inputType={showConfirmPassword ? "text" : "password"}
          rightIcon={
            showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )
          }
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          inputClassName="px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        />

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className={`mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${
              errors.acceptTerms ? "border-red-300" : ""
            }`}
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-purple-600 hover:text-purple-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:text-purple-700">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms}</p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </motion.button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </ValidatedForm>
    </motion.div>
  );
}
