import { api, ApiResponse } from "./api";

// Types
export interface CampaignReceiver {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields?: Record<string, any>;
  status: "pending" | "sent" | "failed" | "bounced" | "unsubscribed";
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  unsubscribedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  _id: string;
  userId: string;
  name: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  books: Array<{
    _id: string;
    title: string;
    author: string;
  }>;
  receivers: CampaignReceiver[];
  senderInfo: {
    name: string;
    email: string;
    company?: string;
  };
  settings: {
    trackOpens: boolean;
    trackClicks: boolean;
    unsubscribeLink: boolean;
    replyTo?: string;
  };
  analytics: {
    totalRecipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    failed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  content: string;
  books?: string[];
  selectedLink?: {
    linkId: string;
    linkUrl: string;
    linkType: "reader" | "landing_page" | "delivery_link";
  };
  senderInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  settings?: {
    trackOpens?: boolean;
    trackClicks?: boolean;
    unsubscribeLink?: boolean;
    replyTo?: string;
  };
  scheduledAt?: string;
}

export interface UpdateCampaignData {
  name?: string;
  subject?: string;
  content?: string;
  books?: string[];
  senderInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  settings?: {
    trackOpens?: boolean;
    trackClicks?: boolean;
    unsubscribeLink?: boolean;
    replyTo?: string;
  };
  scheduledAt?: string;
}

export interface CampaignListResponse {
  campaigns: EmailCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  type: "uploaded" | "written";
  status?: string;
  createdAt: Date;
}

export interface BookLink {
  _id: string;
  title?: string;
  slug: string;
  url: string;
  linkType: "landing_page" | "delivery_link";
  displayName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UploadReceiversResponse {
  count: number;
  campaignId: string;
}

export class EmailCampaignService {
  /**
   * Get all campaigns for the authenticated user
   */
  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<CampaignListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `/email-campaigns${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return api.get<CampaignListResponse>(url);
  }

  /**
   * Get a single campaign by ID
   */
  async getCampaign(campaignId: string): Promise<ApiResponse<EmailCampaign>> {
    return api.get<EmailCampaign>(`/email-campaigns/${campaignId}`);
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    campaignData: CreateCampaignData
  ): Promise<ApiResponse<EmailCampaign>> {
    return api.post<EmailCampaign>("/email-campaigns", campaignData);
  }

  /**
   * Update an existing campaign
   */
  async updateCampaign(
    campaignId: string,
    updateData: UpdateCampaignData
  ): Promise<ApiResponse<EmailCampaign>> {
    return api.put<EmailCampaign>(`/email-campaigns/${campaignId}`, updateData);
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/email-campaigns/${campaignId}`);
  }

  /**
   * Get user's books for campaign selection
   */
  async getUserBooks(params?: { type?: string }): Promise<ApiResponse<Book[]>> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);

    const url = `/email-campaigns/books${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return api.get<Book[]>(url);
  }

  /**
   * Get landing pages and delivery links for a specific book
   */
  async getBookLinks(bookId: string): Promise<ApiResponse<BookLink[]>> {
    return api.get<BookLink[]>(`/email-campaigns/books/${bookId}/links`);
  }

  /**
   * Upload receivers from CSV/Excel file
   */
  async uploadReceivers(
    campaignId: string,
    file: File
  ): Promise<ApiResponse<UploadReceiversResponse>> {
    const formData = new FormData();
    formData.append("receivers", file);

    return api.request<UploadReceiversResponse>({
      method: "POST",
      url: `/email-campaigns/${campaignId}/receivers`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

// Create and export the service instance
export const emailCampaignService = new EmailCampaignService();
