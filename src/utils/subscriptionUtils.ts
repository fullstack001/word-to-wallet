/**
 * Utility functions for subscription validation
 */

export interface Subscription {
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  cardnumber: string;
  avatar: string;
  isAdmin: boolean;
  subscription: Subscription | null;
}

/**
 * Check if user has a valid subscription
 * @param user - User object with subscription data
 * @returns boolean - true if user has valid subscription
 */
export const hasValidSubscription = (user: User | null): boolean => {
  if (!user?.subscription) return false;

  const { status, plan } = user.subscription;

  // Check if subscription is active or trialing
  const isActiveSubscription = status === "active" || status === "trialing";

  // Check if plan is at least basic
  const hasBasicPlan = plan === "basic" || plan === "premium";

  return isActiveSubscription && hasBasicPlan;
};

/**
 * Check if user can access platform (admin or has valid subscription)
 * @param user - User object
 * @returns boolean - true if user can access platform
 */
export const canAccessPlatform = (user: User | null): boolean => {
  if (!user) return false;

  // Admin users can always access
  if (user.isAdmin) return true;

  // Non-admin users need valid subscription
  return hasValidSubscription(user);
};

/**
 * Get subscription status message for display
 * @param user - User object
 * @returns string - Status message
 */
export const getSubscriptionStatusMessage = (user: User | null): string => {
  if (!user) return "Not logged in";

  if (user.isAdmin) return "Admin access";

  if (!user.subscription) return "No subscription";

  const { status, plan } = user.subscription;

  if (status === "active") return `Active ${plan} subscription`;
  if (status === "trialing") return `Trial ${plan} subscription`;
  if (status === "past_due") return `${plan} subscription past due`;
  if (status === "canceled") return `${plan} subscription canceled`;

  return `${plan} subscription (${status})`;
};

/**
 * Check if subscription is in trial period
 * @param user - User object
 * @returns boolean - true if in trial period
 */
export const isInTrialPeriod = (user: User | null): boolean => {
  if (!user?.subscription) return false;

  const { status, trialEnd } = user.subscription;

  if (status !== "trialing") return false;

  if (!trialEnd) return false;

  return new Date(trialEnd) > new Date();
};

/**
 * Get days remaining in trial
 * @param user - User object
 * @returns number - Days remaining in trial, 0 if not in trial
 */
export const getTrialDaysRemaining = (user: User | null): number => {
  if (!isInTrialPeriod(user)) return 0;

  const { trialEnd } = user!.subscription!;
  const endDate = new Date(trialEnd!);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};
