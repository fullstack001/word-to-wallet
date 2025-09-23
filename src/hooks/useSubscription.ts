"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  canAccessPlatform,
  hasValidSubscription,
  isInTrialPeriod,
  getTrialDaysRemaining,
  getSubscriptionStatusMessage,
} from "@/utils/subscriptionUtils";

export function useSubscription() {
  const user = useSelector((state: RootState) => state.user);

  return {
    user,
    canAccess: canAccessPlatform(user),
    hasValidSubscription: hasValidSubscription(user),
    isInTrial: isInTrialPeriod(user),
    trialDaysRemaining: getTrialDaysRemaining(user),
    statusMessage: getSubscriptionStatusMessage(user),
    isAdmin: user?.isAdmin || false,
  };
}
