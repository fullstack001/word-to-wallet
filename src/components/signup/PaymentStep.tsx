"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import StripePaymentForm from "../payment/StripePaymentForm";

interface PaymentStepProps {
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  errors: any;
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentStep({
  user,
  isLoggedIn,
  isLoading,
  errors,
  onPaymentSuccess,
  onPaymentError,
}: PaymentStepProps) {
  const features = [
    "7-day free trial (starts after payment)",
    "Full platform access",
    "Interactive ePub3 creation",
    "Multilingual support",
    "Direct email marketing tools",
    "Cancel anytime",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left side - Features */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What you get with platform access:
          </h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCardIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Secure Payment
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your payment information is processed securely by Stripe. We don't
            store your payment details.
          </p>
        </div>
      </motion.div>

      {/* Right side - Payment Form */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLoggedIn ? "Welcome Back!" : "Account Created Successfully!"}
          </h2>
          <p className="text-gray-600 mb-8">
            {isLoggedIn
              ? "Complete payment to start your 7-day free trial and unlock full platform access."
              : "Your account has been created. Complete payment to start your 7-day free trial and unlock full platform access."}
          </p>

          {/* Stripe Payment Form */}
          <div className="mb-6">
            <StripePaymentForm
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
              isLoading={isLoading}
            />
          </div>

          {errors.general && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error:</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errors.general}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
