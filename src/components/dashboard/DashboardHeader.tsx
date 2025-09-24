"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "../../utils/navigation";
// Subscription utilities are no longer needed as we work directly with props
import { cancelSubscription } from "../../utils/apiUtils";
import { setUser } from "../../store/slices/userSlice";
import {
  ClockIcon,
  PlayIcon,
  XMarkIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  subscription?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status: string;
    plan: string;
    trialStart?: string;
    trialEnd?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: string;
  } | null;
}

export default function DashboardHeader({
  userName,
  userEmail,
  subscription,
}: DashboardHeaderProps) {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();

  // Use subscription data from props directly

  const handleStartTrial = () => {
    navigate("/checkout");
  };

  const handleSubscribe = () => {
    navigate("/checkout");
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription(false);
      dispatch(
        setUser({
          id: "",
          name: userName,
          email: userEmail,
          cardnumber: "",
          avatar: "",
          isAdmin: false,
          subscription: {
            ...subscription,
            plan: subscription?.plan || "pro",
            status: response.data.subscription.status,
            cancelAtPeriodEnd: response.data.subscription.cancelAtPeriodEnd,
          },
        })
      );
      console.log("Subscription canceled successfully");
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const getSubscriptionState = () => {
    if (!subscription) return "no-subscription";
    if (subscription.status === "trialing") {
      // Check if trial is still active
      if (
        subscription.trialEnd &&
        new Date(subscription.trialEnd) > new Date()
      ) {
        return "trial";
      } else {
        return "trial-expired";
      }
    }
    if (subscription.status === "active") return "active";
    return "no-subscription";
  };

  const getSubscriptionStatus = () => {
    const state = getSubscriptionState();
    switch (state) {
      case "no-subscription":
        return "No Subscription";
      case "trial":
        if (subscription?.trialEnd) {
          const daysRemaining = Math.ceil(
            (new Date(subscription.trialEnd).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return `Trial: ${Math.max(0, daysRemaining)} days remaining`;
        }
        return "Trial Active";
      case "trial-expired":
        return "Trial Expired";
      case "active":
        return "Active Subscription";
      default:
        return "No Subscription";
    }
  };

  const renderActionButton = () => {
    const state = getSubscriptionState();

    switch (state) {
      case "no-subscription":
        return (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white text-lg font-semibold mb-1">
                Try Word2Wallet Pro
              </h3>
              <p className="text-white text-lg font-bold mb-2">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold mr-2">
                  FREE
                </span>
                7 days free
              </p>
              <div className="text-white/80 text-sm">
                Then $20.00 per month starting{" "}
                <span className="font-semibold text-white">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-white/60 text-xs mt-1">
                Cancel anytime during trial
              </div>
            </div>

            <button
              onClick={handleStartTrial}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <PlayIcon className="w-5 h-5 mr-3 relative z-10" />
              <span className="relative z-10">Start Free Trial</span>
            </button>
          </div>
        );

      case "trial":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Enjoying your trial? Continue with full access
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubscribe}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Subscribe Now
              </button>
              <button
                onClick={handleCancelSubscription}
                className="inline-flex items-center px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                End Trial
              </button>
            </div>
          </div>
        );

      case "trial-expired":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Your trial has ended. Continue with full access
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CreditCardIcon className="w-5 h-5 mr-3" />
              Upgrade to Continue
            </button>
          </div>
        );

      case "active":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Manage your subscription
              </p>
            </div>
            <button
              onClick={handleCancelSubscription}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel Subscription
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20 pb-8 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 my-4 mt-12">
              <h1 className="text-4xl font-bold text-white">
                Welcome back, {userName || userEmail}!
              </h1>

              {/* Subscription Status Banner */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                <ClockIcon className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">
                  {getSubscriptionStatus()}
                </span>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="flex flex-col items-center space-y-4">
              {/* Action Buttons */}
              {renderActionButton() && (
                <div className="mt-4">{renderActionButton()}</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
