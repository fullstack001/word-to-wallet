import { api } from "./api";

// Types
export interface BookDeliveryStats {
  totalBooks: number;
  totalLinks: number;
  totalDownloads: number;
  totalViews: number;
  totalEmailCaptures: number;
  recentActivity: Array<{
    id: string;
    type: "upload" | "download" | "view" | "email_capture";
    title: string;
    timestamp: string;
    details?: string;
  }>;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  status: "draft" | "active" | "inactive" | "processing" | "ready";
  ebookType?: "doc" | "audio";
  createdAt: string;
  updatedAt: string;

  // File information
  fileName?: string;
  fileKey?: string;
  checksum?: string;

  // File fields (only 1 epub and 1 PDF allowed for regular books, 1 audio file for audio books)
  epubFile?: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    checksum?: string;
    uploadedAt?: string;
  };
  pdfFile?: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    checksum?: string;
    uploadedAt?: string;
  };
  audioFile?: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    checksum?: string;
    uploadedAt?: string;
  };

  // New book information fields
  label?: string; // Book label or subtitle
  series?: string; // Book series name
  volume?: string; // Volume number in series
  tagline?: string; // Book tagline or catchphrase
  notesToReaders?: string; // Special notes to readers
  bookType?: string; // Type of book (advance_copy, excerpt, etc.)
  narrator?: string; // Audio narrator name
  audioQuality?: string; // Audio quality for distribution

  // Cover image fields
  coverImageKey?: string; // S3 key for cover image
  coverImageName?: string; // Original cover image filename
  coverImageSize?: number; // Cover image file size

  // Analytics fields
  downloadCount?: number;
  viewCount?: number;
  uniqueUsers?: number;

  // Multiple files support
  files?: Array<{
    fileKey: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    checksum: string;
    uploadedAt: string;
  }>;
}

export interface DeliveryLink {
  _id: string;
  bookId: string;
  slug: string;
  title: string;
  description?: string;
  accessType: "public" | "email_required" | "password_protected";
  password?: string;
  downloadLimit?: number;
  expiryDate?: string;
  isActive: boolean;
  totalViews: number;
  totalDownloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPage {
  _id: string;
  bookId: string;
  title: string;
  description?: string;
  template: string;
  customCss?: string;
  isActive: boolean;
  totalViews: number;
  totalEmailCaptures: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCapture {
  _id: string;
  email: string;
  bookId?: string;
  deliveryLinkId?: string;
  landingPageId?: string;
  source: string;
  createdAt: string;
}

// Cache for delivery stats to prevent multiple requests
let statsCache: { data: BookDeliveryStats; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

// Delivery API service
export const deliveryApi = {
  // Clear cache to force fresh data
  clearCache: () => {
    statsCache = null;
    console.log("Delivery stats cache cleared");
  },

  // Get delivery dashboard stats
  getDeliveryStats: async (): Promise<BookDeliveryStats> => {
    try {
      // Check cache first
      if (statsCache && Date.now() - statsCache.timestamp < CACHE_DURATION) {
        console.log("Using cached delivery stats");
        return statsCache.data;
      }

      console.log("Fetching fresh delivery stats from API");
      const response = await api.get("/analytics");
      const overview = response.data.overview;

      const statsData = {
        totalBooks: overview.totalBooks || 0,
        totalLinks: overview.totalDeliveryLinks || 0,
        totalDownloads: overview.totalDownloads || 0,
        totalViews: overview.totalViews || 0,
        totalEmailCaptures: overview.totalEmailCaptures || 0,
        recentActivity: [], // Will be populated separately
      };

      // Cache the result
      statsCache = {
        data: statsData,
        timestamp: Date.now(),
      };

      return statsData;
    } catch (error) {
      console.error("Failed to fetch delivery stats:", error);
      // Return default values on error
      return {
        totalBooks: 0,
        totalLinks: 0,
        totalDownloads: 0,
        totalViews: 0,
        totalEmailCaptures: 0,
        recentActivity: [],
      };
    }
  },

  // Get user's books
  getBooks: async (): Promise<Book[]> => {
    const response = await api.get("/books");
    return response.data.books || [];
  },

  // Get user's delivery links
  getDeliveryLinks: async (): Promise<DeliveryLink[]> => {
    const response = await api.get("/delivery-links");
    return response.data.deliveryLinks || [];
  },

  // Get user's landing pages
  getLandingPages: async (): Promise<LandingPage[]> => {
    const response = await api.get("/landing-pages");
    return response.data.landingPages || [];
  },

  // Get user's email captures
  getEmailCaptures: async (): Promise<EmailCapture[]> => {
    const response = await api.get("/email-captures");
    return response.data.emailCaptures || [];
  },

  // Get recent activity (simplified to avoid multiple API calls)
  getRecentActivity: async (
    limit = 10
  ): Promise<BookDeliveryStats["recentActivity"]> => {
    try {
      // For now, return empty array to avoid multiple API requests
      // This can be implemented later with a dedicated activity endpoint
      return [];
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
      return [];
    }
  },

  // Upload audio file for a book
  uploadAudioFile: async (bookId: string, audioFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append("audioFile", audioFile);

    const response = await api.post(`/books/${bookId}/upload-audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default deliveryApi;
