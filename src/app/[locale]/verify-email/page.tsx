"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { authApi } from "@/services/authApi";
import { useLocalizedNavigation } from "@/utils/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { navigate } = useLocalizedNavigation();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "idle"
  >("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    setStatus("verifying");
    try {
      const result = await authApi.verifyEmail(token);
      setStatus("success");
      setMessage("Email verified successfully! Redirecting to dashboard...");

      // Update user in store if available
      if (result.user) {
        dispatch(
          setUser({
            ...result.user,
            emailVerified: true,
          } as any)
        );
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.message ||
          "Failed to verify email. The token may be invalid or expired."
      );
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      await authApi.resendVerification(email);
      setMessage(
        "Verification email sent! Please check your inbox (and spam/junk folder)."
      );
      setStatus("success");
    } catch (error: any) {
      setMessage(
        error.message ||
          "Failed to resend verification email. Please try again."
      );
      setStatus("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === "verifying" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
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
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600">Please wait...</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Email Verified!
                </h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Can't find the email?</strong> Please check your
                    spam or junk folder. The email may have been filtered there.
                  </p>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter your email to resend verification:
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
                    placeholder="your@email.com"
                  />
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
