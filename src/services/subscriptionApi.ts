import { api } from "./api";

// Types
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

export interface SubscriptionData {
  email: string;
  plan: string;
  subscriptionId: string;
  subscriptionType: string;
}

export interface CreateSubscriptionRequest {
  paymentMethodId: string;
  plan?: string;
}

export interface CancelSubscriptionRequest {
  immediately?: boolean;
  reason?: string;
  feedback?: string;
}

export interface UpgradeSubscriptionRequest {
  paymentMethodId?: string;
  plan?: string;
}

// Subscription API service
export const subscriptionApi = {
  // Get current subscription
  getCurrent: async (): Promise<Subscription | null> => {
    try {
      const response = await api.get("/subscriptions");
      return response.data;
    } catch (error) {
      // Return null if no subscription exists
      return null;
    }
  },

  // Create trial subscription
  createTrial: async (): Promise<Subscription> => {
    const response = await api.post("/subscriptions/trial");
    return response.data;
  },

  // Create subscription
  create: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await api.post("/subscriptions", {
      paymentMethodId: data.paymentMethodId,
      plan: data.plan || "pro",
    });
    return response.data;
  },

  // Cancel subscription
  cancel: async (data: CancelSubscriptionRequest = {}): Promise<void> => {
    await api.post("/subscriptions/cancel", {
      immediately: data.immediately || false,
      reason: data.reason,
      feedback: data.feedback,
    });
  },

  // Upgrade trial subscription
  upgradeTrial: async (plan: string = "pro"): Promise<Subscription> => {
    const response = await api.post("/subscriptions/upgrade-trial", { plan });
    return response.data;
  },

  // Upgrade subscription directly
  upgradeDirect: async (
    data: UpgradeSubscriptionRequest
  ): Promise<Subscription> => {
    const response = await api.post("/subscriptions/upgrade-direct", {
      paymentMethodId: data.paymentMethodId,
      plan: data.plan || "pro",
    });
    return response.data;
  },

  // Create setup intent for payment method
  createSetupIntent: async (): Promise<{ clientSecret: string }> => {
    const response = await api.post("/subscriptions/setup-intent");
    return response.data;
  },

  // Create checkout session
  createCheckoutSession: async (priceId: string): Promise<{ url: string }> => {
    const response = await api.post("/create-checkout-session", { priceId });
    return response.data;
  },

  // Add subscription (legacy)
  addSubscription: async (data: SubscriptionData): Promise<Subscription> => {
    const response = await api.post("/subscription/add-subscription", data);
    return response.data;
  },

  // Create Stripe subscription (legacy)
  createStripeSubscription: async (
    paymentMethodId: string,
    name: string,
    email: string,
    priceId: string
  ): Promise<{ subscriptionId: string; error?: any }> => {
    const response = await api.post(
      "/subscription/create-stripe-subscription",
      {
        paymentMethodId,
        name,
        email,
        priceId,
      }
    );
    return response.data;
  },
};

export default subscriptionApi;
