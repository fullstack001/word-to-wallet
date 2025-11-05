import { api } from "./api";

// Types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  cardnumber?: string;
  avatar?: string;
  role: string;
  isAdmin: boolean;
  emailVerified?: boolean;
}

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

export interface AuthResponse {
  token: string;
  user: User;
  subscription?: Subscription;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    const { user, tokens } = response.data;

    // Set token in storage
    api.setAuthToken(tokens.accessToken);

    return {
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        name: user.fullName,
        role: user.role,
        isAdmin: user.role === "admin",
      },
      subscription: user.subscription
        ? {
            stripeCustomerId: user.subscription.stripeCustomerId,
            stripeSubscriptionId: user.subscription.stripeSubscriptionId,
            status: user.subscription.status,
            plan: user.subscription.plan,
            trialStart: user.subscription.trialStart,
            trialEnd: user.subscription.trialEnd,
            currentPeriodStart: user.subscription.currentPeriodStart,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
            canceledAt: user.subscription.canceledAt,
          }
        : undefined,
    };
  },

  // Register email
  registerEmail: async (email: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/register-email", { email });
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    const { user, tokens } = response.data;

    // Set token in storage
    api.setAuthToken(tokens.accessToken);

    return {
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        name: user.fullName,
        role: user.role,
        isAdmin: user.role === "admin",
      },
      subscription: user.subscription
        ? {
            stripeCustomerId: user.subscription.stripeCustomerId,
            stripeSubscriptionId: user.subscription.stripeSubscriptionId,
            status: user.subscription.status,
            plan: user.subscription.plan,
            trialStart: user.subscription.trialStart,
            trialEnd: user.subscription.trialEnd,
            currentPeriodStart: user.subscription.currentPeriodStart,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
            canceledAt: user.subscription.canceledAt,
          }
        : undefined,
    };
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post("/auth/reset-password", data);
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put("/auth/change-password", data);
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data.user;
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put("/auth/profile", userData);
    return response.data.user;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if server request fails
      console.warn("Logout request failed:", error);
    } finally {
      // Always clear local token
      api.removeAuthToken();
    }
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const response = await api.post("/auth/refresh");
    const { accessToken } = response.data;

    // Update stored token
    api.setAuthToken(accessToken);

    return accessToken;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ user: User }> => {
    const response = await api.post("/auth/verify-email", { token });
    return { user: response.data.user };
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await api.post("/auth/resend-verification", { email });
  },

  // Verify email with code
  verifyCode: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/verify-code", { email, code });
    const { user, tokens } = response.data;

    // Set token in storage
    api.setAuthToken(tokens.accessToken);

    return {
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        name: user.fullName,
        role: user.role,
        isAdmin: user.role === "admin",
        emailVerified: user.emailVerified,
      },
      subscription: user.subscription
        ? {
            stripeCustomerId: user.subscription.stripeCustomerId,
            stripeSubscriptionId: user.subscription.stripeSubscriptionId,
            status: user.subscription.status,
            plan: user.subscription.plan,
            trialStart: user.subscription.trialStart,
            trialEnd: user.subscription.trialEnd,
            currentPeriodStart: user.subscription.currentPeriodStart,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
            canceledAt: user.subscription.canceledAt,
          }
        : undefined,
    };
  },
};

export default authApi;
