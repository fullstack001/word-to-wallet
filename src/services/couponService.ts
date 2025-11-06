import { api, apiClient } from "./api";

export interface Coupon {
  _id: string;
  code: string;
  name: string;
  description?: string;
  stripeCouponId: string;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  currency?: string;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  maxRedemptions?: number;
  redeemBy?: string;
  valid: boolean;
  appliesTo?: {
    products?: string[];
    plans?: string[];
  };
  metadata?: Record<string, string>;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  name: string;
  description?: string;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  currency?: string;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  maxRedemptions?: number;
  redeemBy?: string;
  appliesTo?: {
    products?: string[];
    plans?: string[];
  };
  metadata?: Record<string, string>;
}

export interface UpdateCouponRequest {
  name?: string;
  description?: string;
  valid?: boolean;
  appliesTo?: {
    products?: string[];
    plans?: string[];
  };
  metadata?: Record<string, string>;
}

export interface CouponListResponse {
  coupons: Coupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class CouponService {
  private static readonly API_BASE = "/coupons";

  /**
   * Create a new coupon
   */
  static async createCoupon(
    data: CreateCouponRequest
  ): Promise<{ success: boolean; data: Coupon; message: string }> {
    const response = await api.post(this.API_BASE, data);
    return response.data;
  }

  /**
   * Get all coupons
   */
  static async getCoupons(params?: {
    page?: number;
    limit?: number;
    valid?: boolean;
    search?: string;
  }): Promise<CouponListResponse> {
    // Use apiClient directly to get the full response with pagination
    const response = await apiClient.get(this.API_BASE, { params });
    console.log("response", response);
    return {
      coupons: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get coupon by ID
   */
  static async getCouponById(id: string): Promise<Coupon> {
    const response = await api.get(`${this.API_BASE}/${id}`);
    return response.data.data;
  }

  /**
   * Update coupon
   */
  static async updateCoupon(
    id: string,
    data: UpdateCouponRequest
  ): Promise<{ success: boolean; data: Coupon; message: string }> {
    const response = await api.put(`${this.API_BASE}/${id}`, data);
    return response.data;
  }

  /**
   * Delete coupon
   */
  static async deleteCoupon(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`${this.API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Toggle coupon validity
   */
  static async toggleCouponValidity(
    id: string
  ): Promise<{ success: boolean; data: Coupon; message: string }> {
    const response = await api.patch(`${this.API_BASE}/${id}/toggle-validity`);
    return response.data;
  }

  /**
   * Validate coupon code
   */
  static async validateCoupon(code: string): Promise<{
    success: boolean;
    data?: {
      code: string;
      name: string;
      discountType: "percentage" | "fixed_amount";
      discountValue: number;
      currency?: string;
      duration: "once" | "repeating" | "forever";
      durationInMonths?: number;
      stripeCouponId: string;
    };
    message: string;
  }> {
    // Use apiClient directly to get the full response structure
    const response = await apiClient.get(`${this.API_BASE}/validate`, {
      params: { code },
    });

    // Backend returns: { success: true, message: "...", data: {...} }
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  }
}

export default CouponService;
