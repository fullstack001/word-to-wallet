"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { login } from "../../../store/slices/authSlice";
import { setUser } from "../../../store/slices/userSlice";
import { loginUser } from "../../../utils/apiUtils";
import { authApi } from "../../../services/authApi";
import { ButtonLoading } from "../../../components/common/Loading";
import { useFormValidation } from "../../../hooks/useFormValidation";
import {
  VALIDATION_SCHEMAS,
  VALIDATION_PATTERNS,
} from "../../../utils/validation";
import { EmailField, PasswordField } from "../../../components/forms/FormField";
import ValidatedForm from "../../../components/forms/ValidatedForm";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();

  // Form validation
  const validation = useFormValidation({
    schema: VALIDATION_SCHEMAS.login,
    initialData: {
      email: "",
      password: "",
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    const validationResult = validation.validate();
    if (!validationResult.isValid) {
      return;
    }

    setLoading(true);

    try {
      const { token, user, subscription } = await loginUser(
        validation.data.email,
        validation.data.password
      );

      // Check if email verification is required (and user is not admin)
      if (!user.emailVerified && !user.isAdmin) {
        // Show verification code input
        setUserEmail(user.email);
        setVerificationStep(true);
        setLoading(false);
        // Store token temporarily (will be updated after verification)
        localStorage.setItem("authToken", token);

        // Dispatch user data but don't navigate yet
        dispatch(
          setUser({
            email: user.email,
            name: user.name || "",
            cardnumber: user.cardnumber || "",
            id: user.id || "",
            avatar: user.avatar || "",
            isAdmin: user.isAdmin || false,
            subscription: subscription
              ? {
                  stripeCustomerId: subscription.stripeCustomerId,
                  stripeSubscriptionId: subscription.stripeSubscriptionId,
                  status: subscription.status,
                  plan: subscription.plan,
                  trialStart: subscription.trialStart,
                  trialEnd: subscription.trialEnd,
                  currentPeriodStart: subscription.currentPeriodStart,
                  currentPeriodEnd: subscription.currentPeriodEnd,
                  cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                  canceledAt: subscription.canceledAt,
                }
              : null,
          })
        );
        dispatch(login());
        return;
      }

      // Dispatch actions to set user data and login state
      dispatch(
        setUser({
          email: user.email,
          name: user.name || "",
          cardnumber: user.cardnumber || "",
          id: user.id || "",
          avatar: user.avatar || "",
          isAdmin: user.isAdmin || false,
          subscription: subscription
            ? {
                stripeCustomerId: subscription.stripeCustomerId,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                status: subscription.status,
                plan: subscription.plan,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                canceledAt: subscription.canceledAt,
              }
            : null,
        })
      );
      dispatch(login());

      // Always store the token in localStorage
      localStorage.setItem("authToken", token);

      // Check subscription status and redirect appropriately
      if (user.isAdmin) {
        // Admin users go to admin dashboard
        navigate("/admin/dashboard");
      } else {
        // User is in trial period - redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
      const response = await authApi.verifyCode(userEmail, verificationCode);

      // Store auth tokens
      localStorage.setItem("authToken", response.token);

      // Update Redux store
      dispatch(
        setUser({
          email: response.user.email,
          name: response.user.name || response.user.fullName || "",
          cardnumber: "",
          id: response.user.id,
          avatar: "",
          isAdmin: response.user.isAdmin || false,
          subscription: response.subscription
            ? {
                stripeCustomerId: response.subscription.stripeCustomerId,
                stripeSubscriptionId:
                  response.subscription.stripeSubscriptionId,
                status: response.subscription.status,
                plan: response.subscription.plan,
                trialStart: response.subscription.trialStart,
                trialEnd: response.subscription.trialEnd,
                currentPeriodStart: response.subscription.currentPeriodStart,
                currentPeriodEnd: response.subscription.currentPeriodEnd,
                cancelAtPeriodEnd: response.subscription.cancelAtPeriodEnd,
                canceledAt: response.subscription.canceledAt,
              }
            : null,
        })
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
      await authApi.resendVerification(userEmail);
      setVerificationError("");
      // Show success message
      alert("Verification code resent! Please check your email.");
    } catch (error: any) {
      setVerificationError(
        error.response?.data?.message ||
          error.message ||
          "Failed to resend verification code. Please try again."
      );
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);

    // Validate email
    if (
      !forgotPasswordEmail ||
      !VALIDATION_PATTERNS.email.test(forgotPasswordEmail)
    ) {
      setForgotPasswordError("Please enter a valid email address");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      await authApi.forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
    } catch (error: any) {
      setForgotPasswordError(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // If verification step, show code input form
  if (verificationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <img
                  src="/logo.png"
                  alt="Word2Wallet Logo"
                  className="w-10 h-10"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">We've sent a verification code to</p>
              <p className="text-gray-900 font-semibold mt-1">{userEmail}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  disabled={isVerifying}
                  autoComplete="off"
                />
              </div>

              {verificationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {verificationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none transition-colors duration-200"
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationStep(false);
                    setVerificationCode("");
                    setVerificationError("");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <img src="/logo.png" alt="Word2Wallet Logo" className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to your Word2Wallet account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20">
          <ValidatedForm
            onSubmit={handleSubmit}
            validation={validation}
            showGeneralError={true}
            generalError={error}
            loading={loading}
            className="space-y-6"
          >
            <EmailField
              name="email"
              label="Email address"
              value={validation.data.email}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              error={validation.errors.email}
              placeholder="Enter your email"
              required
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
              inputClassName="pl-10 pr-3 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
            />

            <PasswordField
              name="password"
              label="Password"
              value={validation.data.password}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              error={validation.errors.password}
              placeholder="Enter your password"
              required
              inputType={showPassword ? "text" : "password"}
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              rightIcon={
                showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              inputClassName="pl-10 pr-12 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign in
                </>
              </button>
            </div>
          </ValidatedForm>

          <div className="mt-8">
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign up here
                </button>
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/")}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail("");
                setForgotPasswordError("");
                setForgotPasswordSuccess(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            {forgotPasswordSuccess ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  <p className="font-semibold mb-1">Email sent successfully!</p>
                  <p>
                    We've sent a password reset link to{" "}
                    <strong>{forgotPasswordEmail}</strong>. Please check your
                    email and follow the instructions.
                  </p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Can't find the email?</strong> Please check your
                    spam or junk folder. The email may have been filtered there.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordError("");
                    setForgotPasswordSuccess(false);
                  }}
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgotPasswordEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="forgotPasswordEmail"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => {
                        setForgotPasswordEmail(e.target.value);
                        setForgotPasswordError("");
                      }}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                      disabled={forgotPasswordLoading}
                    />
                  </div>
                </div>

                {forgotPasswordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {forgotPasswordError}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail("");
                      setForgotPasswordError("");
                      setForgotPasswordSuccess(false);
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    disabled={forgotPasswordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading || !forgotPasswordEmail}
                    className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {forgotPasswordLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
