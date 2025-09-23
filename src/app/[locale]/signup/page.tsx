"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import { setUser } from "../../../store/slices/userSlice";
import { login } from "../../../store/slices/authSlice";
import api from "../../../utils/api";
import EnvironmentCheck from "../../../components/debug/EnvironmentCheck";
import SignupHeader from "../../../components/signup/SignupHeader";
import SignupForm from "../../../components/signup/SignupForm";
import SignupFeatures from "../../../components/signup/SignupFeatures";
import PaymentStep from "../../../components/signup/PaymentStep";

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

export default function SignupPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  // Get authentication state from Redux
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  // Always start with step 1 for new signups
  useEffect(() => {
    // Only go to step 2 if user is already authenticated
    if (isLoggedIn && user) {
      setCurrentStep(2);
    } else {
      // Always start with step 1 for new signups
      setCurrentStep(1);
    }
  }, [isLoggedIn, user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Create user account WITHOUT free trial access
      const response = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        // Don't start free trial yet - only after payment
        startTrial: false,
      });

      console.log("response.data.user", response.data.user);
      // Store auth tokens
      localStorage.setItem("authToken", response.data.tokens.accessToken);
      localStorage.setItem("refreshToken", response.data.tokens.refreshToken);

      // Update Redux store
      dispatch(setUser(response.data.user));
      dispatch(login());

      // Move to payment step - user must complete payment to start free trial
      setCurrentStep(2);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setPaymentMethodId(paymentMethodId);
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create subscription with the payment method - THIS starts the free trial
      const response = await api.post("/subscriptions", {
        paymentMethodId: paymentMethodId,
        plan: "basic",
        startTrial: true, // Start free trial only after payment
      });

      // Update user data with subscription info
      dispatch(
        setUser({
          ...user,
          subscription: response.data.subscription,
        })
      );

      // Redirect to dashboard - now they have free trial access
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Payment processing failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setErrors({
      general: error,
    });
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <SignupHeader currentStep={currentStep} />

          {currentStep === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Features */}
              <SignupFeatures />

              {/* Right side - Signup Form */}
              <SignupForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isLoading={isLoading}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <PaymentStep
              user={user}
              isLoggedIn={isLoggedIn}
              isLoading={isLoading}
              errors={errors}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>

        {/* Debug component - remove in production */}
        {process.env.NODE_ENV === "development" && <EnvironmentCheck />}
      </div>
  );
}
