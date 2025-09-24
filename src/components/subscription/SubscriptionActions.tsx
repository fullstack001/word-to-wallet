"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "../../utils/navigation";
import {
  hasNoSubscription,
  isInTrialPeriod,
  isTrialExpired,
  hasActivePaidSubscription,
} from "../../utils/subscriptionUtils";
import {
  createTrialSubscription,
  cancelSubscription,
  createSubscription,
} from "../../utils/apiUtils";
import { setUser } from "../../store/slices/userSlice";
import { User } from "../../utils/subscriptionUtils";
import {
  PlayIcon,
  XMarkIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface SubscriptionActionsProps {
  user: User | null;
  className?: string;
}

export default function SubscriptionActions({
  user,
  className = "",
}: SubscriptionActionsProps) {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await createTrialSubscription();

      // Update user state with new subscription
      dispatch(
        setUser({
          ...user,
          subscription: response.data.subscription,
        })
      );

      // Show success message or redirect
      console.log("Trial started successfully");
    } catch (error) {
      console.error("Failed to start trial:", error);
      setError("Failed to start trial. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = () => {
    // Navigate to subscription/payment page
    navigate("/signup");
  };

  const handleCancelSubscription = async () => {
    if (!user?.subscription?.stripeSubscriptionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await cancelSubscription(false); // Cancel at period end

      // Update user state to reflect cancellation
      dispatch(
        setUser({
          ...user,
          subscription: {
            ...user.subscription,
            status: response.data.subscription.status,
            cancelAtPeriodEnd: response.data.subscription.cancelAtPeriodEnd,
          },
        })
      );

      console.log("Subscription canceled successfully");
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionState = () => {
    if (!user) return "no-user";
    if (user.isAdmin) return "admin";
    if (hasNoSubscription(user)) return "no-subscription";
    if (isInTrialPeriod(user)) return "trial";
    if (isTrialExpired(user)) return "trial-expired";
    if (hasActivePaidSubscription(user)) return "active";
    return "unknown";
  };

  const subscriptionState = getSubscriptionState();

  const renderActionButton = () => {
    switch (subscriptionState) {
      case "no-subscription":
        return (
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            {isLoading ? "Starting..." : "Start Free Trial"}
          </button>
        );

      case "trial":
        return (
          <button
            onClick={handleSubscribe}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Subscribe Now
          </button>
        );

      case "trial-expired":
        return (
          <button
            onClick={handleSubscribe}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Subscribe to Continue
          </button>
        );

      case "active":
        return (
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            {isLoading ? "Canceling..." : "Cancel Subscription"}
          </button>
        );

      case "admin":
        return (
          <div className="inline-flex items-center px-6 py-3 bg-purple-100 text-purple-800 rounded-lg font-medium">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            Admin Access
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (subscriptionState) {
      case "no-subscription":
        return "Start your free trial to access all features";
      case "trial":
        return "You're currently on a free trial";
      case "trial-expired":
        return "Your trial has expired. Subscribe to continue";
      case "active":
        return "You have an active subscription";
      case "admin":
        return "You have admin access";
      default:
        return "";
    }
  };

  if (subscriptionState === "no-user") {
    return null;
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Subscription Status
          </h3>
          <p className="text-gray-600 text-sm">{getStatusMessage()}</p>
        </div>

        <div className="flex-shrink-0">{renderActionButton()}</div>
      </div>
    </div>
  );
}
