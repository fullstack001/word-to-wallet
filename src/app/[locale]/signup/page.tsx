"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { setUser } from "@/store/slices/userSlice";
import { login } from "@/store/slices/authSlice";
import api from "@/utils/api";
import { authApi } from "@/services/authApi";
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
  const [verificationStep, setVerificationStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

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
      // Create user account - no tokens returned yet
      const response = await api.post("/auth/register", {
        email: validation.data.email,
        password: validation.data.password,
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        // Start free trial immediately - no payment required
        startTrial: true,
      });

      console.log("Registration response:", response);
      console.log("Registration response.data:", response.data);

      // The response structure from backend is: { success: true, message: "...", data: { email: "...", requiresVerification: true } }
      // With axios, response.data is the response body, so we access response.data.data
      const responseData = response.data?.data || response.data;

      // Check if verification is required
      if (
        responseData?.requiresVerification ||
        response.data?.requiresVerification
      ) {
        // Show verification code input
        const email =
          responseData?.email || response.data?.email || validation.data.email;
        setRegisteredEmail(email);
        setVerificationStep(true);
        setIsLoading(false);
        return;
      }

      // If no verification required (shouldn't happen with new flow), proceed as before
      if (responseData?.tokens || response.data?.tokens) {
        const tokens = responseData?.tokens || response.data?.tokens;
        const user = responseData?.user || response.data?.user;

        // Store auth tokens
        localStorage.setItem("authToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // Update Redux store
        dispatch(setUser(user));
        dispatch(login());

        // Redirect directly to dashboard
        navigate("/dashboard");
      } else {
        // If we reach here, something unexpected happened
        throw new Error(
          "Unexpected response format from registration endpoint"
        );
      }
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      // Verify code and get tokens
      const response = await authApi.verifyCode(
        registeredEmail,
        verificationCode
      );

      // Store auth tokens
      localStorage.setItem("authToken", response.token);
      if (response.subscription) {
        // Store any subscription info if needed
      }

      // Update Redux store
      dispatch(
        setUser({
          ...response.user,
          name: response.user.name || response.user.fullName || "",
          subscription: response.subscription || {
            status: "trialing",
            plan: "free",
          },
        } as any)
      );
      dispatch(login());

      // Redirect to dashboard after successful verification
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationError(
        error.response?.data?.message ||
          error.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await authApi.resendVerification(registeredEmail);
      setVerificationError("");
      // Show success message (you could add a toast notification here)
      alert("Verification code resent! Please check your email.");
    } catch (error: any) {
      setVerificationError(
        error.response?.data?.message ||
          error.message ||
          "Failed to resend verification code. Please try again."
      );
    }
  };

  // If verification step, show code input form
  if (verificationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">We've sent a verification code to</p>
              <p className="text-gray-900 font-semibold mt-1">
                {registeredEmail}
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Can't find the email?</strong> Please check your spam
                  or junk folder. The email may have been filtered there.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                    setVerificationError("");
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  disabled={isVerifying}
                  autoComplete="off"
                />
              </div>

              {verificationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {verificationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
