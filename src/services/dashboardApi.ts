import { api } from "./api";

// Types
export interface DashboardData {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
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
  };
  stats?: {
    totalBooks?: number;
    totalCourses?: number;
    totalDownloads?: number;
    totalViews?: number;
    totalEmailCaptures?: number;
    totalDeliveryLinks?: number;
    totalLandingPages?: number;
  };
  recentActivity?: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    details?: string;
  }>;
}

// Dashboard API service
export const dashboardApi = {
  // Get dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<DashboardData["user"]> => {
    const response = await api.get("/auth/profile");
    return response.data.user;
  },

  // Get subscription info
  getSubscription: async (): Promise<DashboardData["subscription"]> => {
    try {
      const response = await api.get("/subscriptions");
      return response.data;
    } catch (error) {
      return undefined;
    }
  },

  // Get analytics/stats
  getStats: async (): Promise<DashboardData["stats"]> => {
    try {
      const response = await api.get("/analytics");
      return response.data.overview;
    } catch (error) {
      return undefined;
    }
  },

  // Get recent activity
  getRecentActivity: async (
    limit = 10
  ): Promise<DashboardData["recentActivity"]> => {
    try {
      const response = await api.get("/activity/recent", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
};

export default dashboardApi;
