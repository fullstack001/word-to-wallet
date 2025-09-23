"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  getSubscriptionStatusMessage,
  isInTrialPeriod,
  getTrialDaysRemaining,
  canAccessPlatform,
} from "@/utils/subscriptionUtils";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface SubscriptionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function SubscriptionStatus({
  showDetails = false,
  className = "",
}: SubscriptionStatusProps) {
  const user = useSelector((state: RootState) => state.user);

  if (!user) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <XCircleIcon className="w-5 h-5" />
        <span>Not logged in</span>
      </div>
    );
  }

  const canAccess = canAccessPlatform(user);
  const isTrial = isInTrialPeriod(user);
  const trialDaysRemaining = getTrialDaysRemaining(user);
  const statusMessage = getSubscriptionStatusMessage(user);

  const getStatusIcon = () => {
    if (user.isAdmin) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }

    if (canAccess) {
      if (isTrial) {
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      }
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }

    return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (user.isAdmin) return "text-green-600";
    if (canAccess) return isTrial ? "text-blue-600" : "text-green-600";
    return "text-red-600";
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {statusMessage}
        </span>
        {showDetails && isTrial && trialDaysRemaining > 0 && (
          <span className="text-xs text-gray-500">
            {trialDaysRemaining} days remaining
          </span>
        )}
        {showDetails && !canAccess && !user.isAdmin && (
          <span className="text-xs text-red-500">
            Subscription required for access
          </span>
        )}
      </div>
    </div>
  );
}
