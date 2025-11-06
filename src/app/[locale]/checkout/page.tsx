"use client";

import React, { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { setUser } from "../../../store/slices/userSlice";
import type { RootState } from "../../../store/store";
import api from "../../../utils/api";
import { CouponService } from "../../../services/couponService";
import { motion } from "framer-motion";
import {
  CheckIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import StripePaymentForm from "../../../components/payment/StripePaymentForm";

interface CheckoutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = use(params);
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutType, setCheckoutType] = useState<"trial" | "upgrade">(
    "trial"
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    name: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
    currency?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Original subscription price
  const ORIGINAL_PRICE = 19.99;

  // Calculate discounted price based on coupon
  const calculateDiscountedPrice = () => {
    if (!appliedCoupon) return ORIGINAL_PRICE;

    if (appliedCoupon.discountType === "percentage") {
      return ORIGINAL_PRICE * (1 - appliedCoupon.discountValue / 100);
    } else {
      // Fixed amount discount - discountValue is in dollars (not cents for display)
      return Math.max(0, ORIGINAL_PRICE - appliedCoupon.discountValue);
    }
  };

  const finalPrice = calculateDiscountedPrice();
  const discountAmount = ORIGINAL_PRICE - finalPrice;

  useEffect(() => {
    // Determine checkout type based on user subscription status
    if (user?.subscription?.status === "trialing") {
      setCheckoutType("upgrade");
    } else {
      setCheckoutType("trial");
    }
  }, [user]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponValidating(true);
    setCouponError(null);

    try {
      const result = await CouponService.validateCoupon(couponCode.trim());
      console.log("Coupon validation result:", result);
      if (result.success && result.data) {
        setAppliedCoupon({
          code: result.data.code,
          name: result.data.name,
          discountType: result.data.discountType,
          discountValue: result.data.discountValue,
          currency: result.data.currency,
        });
        setCouponError(null);
        setCouponCode(""); // Clear the input after successful validation
      } else {
        setCouponError(result.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      console.error("Coupon validation error:", err);
      setCouponError(err.message || "Failed to validate coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: any = {
        paymentMethodId,
      };

      // Add coupon code if applied
      if (appliedCoupon) {
        requestBody.couponCode = appliedCoupon.code;
      }

      if (checkoutType === "trial" && !user?.subscription?.cancelAtPeriodEnd) {
        // Create trial subscription with payment method
        const response = await api.post("/subscriptions/trial", requestBody);

        // Update user state with new subscription
        dispatch(
          setUser({
            ...user,
            subscription: response.data.subscription,
          })
        );
      } else {
        // Direct subscription upgrade (no trial required)
        const response = await api.post("/subscriptions/upgrade-direct", {
          ...requestBody,
          plan: "pro",
        });

        // Update user state with new subscription
        dispatch(
          setUser({
            ...user,
            subscription: response.data.subscription,
          })
        );
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Payment processing failed:", error);
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {checkoutType === "trial"
                ? "Start Your Free Trial"
                : "Upgrade Your Subscription"}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {checkoutType === "trial"
                ? "Get full access to Word2Wallet Pro with a 7-day free trial"
                : "Continue with full access to Word2Wallet Pro"}
            </p>
          </div>
        </motion.div>

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
                What you get with Word2Wallet Pro:
              </h2>
              <div className="space-y-4">
                {[
                  "7-day free trial (starts immediately)",
                  "Full platform access",
                  "Interactive ePub3 creation",
                  "Multilingual support",
                  "Direct email marketing tools",
                  "Cancel anytime",
                ].map((feature, index) => (
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
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Trial Details
                </h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• 7 days completely free</p>
                <p>• No commitment required</p>
                <p>• Cancel anytime during trial</p>
                <p>• Full access to all features</p>
              </div>
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
                {checkoutType === "trial" &&
                !user?.subscription?.cancelAtPeriodEnd
                  ? "Complete Your Trial Setup"
                  : "Complete Your Upgrade"}
              </h2>
              <p className="text-gray-600">
                {checkoutType === "trial" &&
                !user?.subscription?.cancelAtPeriodEnd
                  ? "Add your payment method to start your free trial"
                  : "Add your payment method to continue with full access"}
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Coupon Code Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="w-4 h-4 inline mr-2" />
                Have a coupon code?
              </label>
              {!appliedCoupon ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleValidateCoupon();
                      }
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={couponValidating}
                  />
                  <button
                    onClick={handleValidateCoupon}
                    disabled={couponValidating || !couponCode.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponValidating ? "..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">
                        {appliedCoupon.name}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-900"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="text-gray-700 line-through">
                        ${ORIGINAL_PRICE.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-700 font-semibold">
                        {appliedCoupon.discountType === "percentage"
                          ? `-${appliedCoupon.discountValue}%`
                          : `-$${appliedCoupon.discountValue.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-1">
                      <span className="text-gray-900">After Trial:</span>
                      <span className="text-green-700">
                        ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You'll be charged ${finalPrice.toFixed(2)} after your
                      7-day free trial ends
                    </p>
                  </div>
                </div>
              )}
              {couponError && (
                <p className="mt-2 text-sm text-red-600">{couponError}</p>
              )}
            </div>

            {/* Stripe Payment Form */}
            <StripePaymentForm
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isLoading={isLoading}
              user={user}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
