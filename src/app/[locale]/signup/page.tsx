"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { setUser } from "@/store/slices/userSlice";
import { login } from "@/store/slices/authSlice";
import api from "@/utils/api";
import SignupHeader from "@/components/signup/SignupHeader";
import SignupForm from "@/components/signup/SignupForm";
import SignupFeatures from "@/components/signup/SignupFeatures";
import { useFormValidation } from "@/hooks/useFormValidation";
import { VALIDATION_SCHEMAS } from "@/utils/validation";

export default function SignupPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form validation
  const validation = useFormValidation({
    schema: VALIDATION_SCHEMAS.signup,
    initialData: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      acceptTerms: false,
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Authentication state not needed for signup flow

  // Always start with step 1 for new signups
  useEffect(() => {
    // Always start with step 1 for new signups - no payment step needed
    setCurrentStep(1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const validationResult = validation.validate();
    if (!validationResult.isValid) {
      return;
    }

    setIsLoading(true);
    validation.clearAllErrors();

    try {
      // Create user account WITH free trial access
      const response = await api.post("/auth/register", {
        email: validation.data.email,
        password: validation.data.password,
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        // Start free trial immediately - no payment required
        startTrial: true,
      });

      console.log("response.data.user", response.data.user);
      // Store auth tokens
      localStorage.setItem("authToken", response.data.tokens.accessToken);
      localStorage.setItem("refreshToken", response.data.tokens.refreshToken);

      // Update Redux store
      dispatch(setUser(response.data.user));
      dispatch(login());

      // Redirect directly to dashboard - user now has free trial access
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      validation.setError(
        "general",
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Payment handlers removed - no payment step needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <SignupHeader currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Features */}
          <SignupFeatures />

          {/* Right side - Signup Form */}
          <SignupForm
            formData={validation.data}
            setFormData={validation.setData}
            errors={validation.errors}
            setErrors={validation.setError}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
