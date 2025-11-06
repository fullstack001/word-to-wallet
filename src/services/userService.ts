import { api, apiClient } from "./api";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class UserService {
  private static readonly API_BASE = "/users";

  /**
   * Get all users (Admin only)
   */
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
  }): Promise<UserListResponse> {
    // Use apiClient directly to get the full response with pagination
    const response = await apiClient.get(this.API_BASE, { params });

    return {
      users: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    const response = await api.get(`${this.API_BASE}/${id}`);
    return response.data.data;
  }

  /**
   * Update user
   */
  static async updateUser(
    id: string,
    data: UpdateUserRequest
  ): Promise<{ success: boolean; data: User; message: string }> {
    const response = await api.put(`${this.API_BASE}/${id}`, data);
    return response.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`${this.API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Toggle user active status
   */
  static async toggleUserStatus(
    id: string
  ): Promise<{ success: boolean; data: User; message: string }> {
    const response = await api.patch(`${this.API_BASE}/${id}/toggle-status`);
    return response.data;
  }
}

export default UserService;
