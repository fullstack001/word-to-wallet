import { api } from "./api";

// Backend status values
export enum EmailCaptureStatus {
  NEW = "new",
  CONTACTED = "contacted",
  CONVERTED = "converted",
  BOUNCED = "bounced",
}

export interface EmailCaptureMetadata {
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface PopulatedBook {
  _id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
}

export interface PopulatedDeliveryLink {
  _id: string;
  title: string;
  slug: string;
}

export interface PopulatedLandingPage {
  _id: string;
  title: string;
  slug: string;
}

export interface EmailCapture {
  _id: string;
  bookId: string | PopulatedBook;
  userId: string;
  deliveryLinkId?: string | PopulatedDeliveryLink;
  landingPageId?: string | PopulatedLandingPage;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Virtual field
  bookTitle?: string; // Virtual field from populated data
  source: string;
  isConfirmed: boolean;
  confirmationToken?: string;
  confirmationTokenExpiry?: Date;
  confirmedAt?: Date;
  subscribedToNewsletter: boolean; // Whether user opted-in to newsletter
  metadata: EmailCaptureMetadata;
  status: EmailCaptureStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCapturesResponse {
  emailCaptures: EmailCapture[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface EmailCaptureStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  byBook: Record<string, number>;
  byDate: Record<string, number>;
  byCountry: Record<string, number>;
  averagePerDay: number;
  topSources: Array<{ source: string; count: number }>;
  topBooks: Array<{ book: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
}

export interface GetEmailCapturesParams {
  page?: number;
  limit?: number;
  bookId?: string;
  status?: EmailCaptureStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateEmailCaptureData {
  firstName?: string;
  lastName?: string;
  status?: EmailCaptureStatus;
  tags?: string[];
  notes?: string;
  subscribedToNewsletter?: boolean;
}

export interface BulkUpdateData {
  emailCaptureIds: string[];
  status?: EmailCaptureStatus;
  tags?: string[];
  notes?: string;
}

export interface ExportEmailCapturesParams {
  format?: "csv" | "json";
  bookId?: string;
  status?: EmailCaptureStatus;
  startDate?: string;
  endDate?: string;
}

export const emailCaptureApi = {
  // Get all email captures with filtering and pagination
  getEmailCaptures: async (
    params?: GetEmailCapturesParams
  ): Promise<EmailCapturesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.bookId) queryParams.append("bookId", params.bookId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await api.get(`/email-captures?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single email capture by ID
  getEmailCapture: async (id: string): Promise<EmailCapture> => {
    const response = await api.get(`/email-captures/${id}`);
    return response.data;
  },

  // Update an email capture
  updateEmailCapture: async (
    id: string,
    data: UpdateEmailCaptureData
  ): Promise<EmailCapture> => {
    const response = await api.put(`/email-captures/${id}`, data);
    return response.data;
  },

  // Delete an email capture
  deleteEmailCapture: async (id: string): Promise<void> => {
    await api.delete(`/email-captures/${id}`);
  },

  // Bulk update email captures
  bulkUpdateEmailCaptures: async (data: BulkUpdateData): Promise<any> => {
    const response = await api.put("/email-captures/bulk/update", data);
    return response.data;
  },

  // Export email captures
  exportEmailCaptures: async (
    params?: ExportEmailCapturesParams
  ): Promise<string | any> => {
    const queryParams = new URLSearchParams();

    if (params?.format) queryParams.append("format", params.format);
    if (params?.bookId) queryParams.append("bookId", params.bookId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    // For CSV format, we need to get the raw response
    if (params?.format === "csv") {
      const response = await api.download(
        `/email-captures/export?${queryParams.toString()}`
      );
      return response;
    }

    const response = await api.get(
      `/email-captures/export?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get email capture statistics
  getEmailCaptureStats: async (params?: {
    startDate?: string;
    endDate?: string;
    bookId?: string;
  }): Promise<EmailCaptureStats> => {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.bookId) queryParams.append("bookId", params.bookId);

    const response = await api.get(
      `/email-captures/stats?${queryParams.toString()}`
    );
    return response.data;
  },

  // Add tags to email captures
  addTagsToEmailCaptures: async (
    emailCaptureIds: string[],
    tags: string[]
  ): Promise<any> => {
    const response = await api.put("/email-captures/bulk/tags/add", {
      emailCaptureIds,
      tags,
    });
    return response.data;
  },

  // Remove tags from email captures
  removeTagsFromEmailCaptures: async (
    emailCaptureIds: string[],
    tags: string[]
  ): Promise<any> => {
    const response = await api.put("/email-captures/bulk/tags/remove", {
      emailCaptureIds,
      tags,
    });
    return response.data;
  },
};

export default emailCaptureApi;
