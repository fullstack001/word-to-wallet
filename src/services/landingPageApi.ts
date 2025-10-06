import { api } from "./index";

export interface LandingPage {
  id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    coverImageUrl?: string;
  };
  userId: string;
  title: string;
  description?: string;
  slug: string;
  isActive: boolean;
  design: {
    theme: "default" | "minimal" | "modern" | "classic";
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  content: {
    heroTitle: string;
    heroSubtitle?: string;
    heroImage?: string;
    features?: string[];
    testimonials?: Array<{
      name: string;
      text: string;
      avatar?: string;
    }>;
    callToAction: {
      text: string;
      buttonText: string;
      buttonColor: string;
    };
    aboutAuthor?: {
      name: string;
      bio: string;
      avatar?: string;
      socialLinks?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
      };
    };
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  analytics: {
    totalViews: number;
    totalConversions: number;
    uniqueVisitors: number;
    lastAccessed?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Landing Page Settings
export interface LandingPageSettings {
  pageLayout: string;
  include3DEffects: boolean;
  pageTheme: string;
  accentColor: string;
  pageTitle: string;
  buttonText: string;
  heading1: {
    type: "none" | "tagline" | "newsletter" | "get_free_copy" | "custom";
    customText?: string;
  };
  heading2: {
    type: "none" | "tagline" | "subscribers" | "get_free_copy" | "custom";
    customText?: string;
  };
  popupMessage: {
    type: "none" | "default" | "custom";
    customText?: string;
  };
  pageText: {
    type: "none" | "book_description" | "custom";
    customText?: string;
  };
}

export interface DownloadPageSettings {
  pageName: string;
  expirationDate?: string;
  downloadLimit?: number;
  landingPageSettings: LandingPageSettings;
  advancedSettings?: {
    allowMultipleDownloads?: boolean;
    requireEmailVerification?: boolean;
    customRedirectUrl?: string;
  };
}

export interface EmailSignupPageSettings {
  pageName: string;
  mailingListAction: "none" | "optional" | "required";
  integrationList: string;
  expirationDate?: string;
  claimLimit?: number;
  askFirstName: boolean;
  askLastName: boolean;
  confirmEmail: boolean;
  landingPageSettings: LandingPageSettings;
  thankYouPageSettings?: {
    title: string;
    message: string;
    buttonText: string;
    redirectUrl?: string;
  };
  advancedSettings?: {
    doubleOptIn?: boolean;
    customThankYouMessage?: string;
    autoResponder?: boolean;
  };
}

export interface RestrictedPageSettings {
  pageName: string;
  restrictedList: string;
  redirectUrl?: string;
  expirationDate?: string;
  downloadLimit?: number;
  confirmEmail: boolean;
  landingPageSettings: LandingPageSettings;
  deliveryPageSettings?: {
    title: string;
    message: string;
    downloadButtonText: string;
    showDownloadCount?: boolean;
  };
  advancedSettings?: {
    allowBookmarking?: boolean;
    customRestrictionMessage?: string;
    requireEmailVerification?: boolean;
  };
}

export interface UniversalBookLinkSettings {
  linkName: string;
  selectedBook: string;
  audioSample: string;
  displayEbookLinks: boolean;
  displayAudiobookLinks: boolean;
  displayPaperbackLinks: boolean;
  expirationDate?: string;
  landingPageSettings: LandingPageSettings;
  advancedSettings?: {
    trackClicks?: boolean;
    customDomain?: string;
    analyticsEnabled?: boolean;
  };
}

export type LandingPageType =
  | "simple_download"
  | "email_signup"
  | "restricted"
  | "universal_link";

export interface CreateLandingPageData {
  bookId: string;
  type: LandingPageType;
  downloadPage?: DownloadPageSettings;
  emailSignupPage?: EmailSignupPageSettings;
  restrictedPage?: RestrictedPageSettings;
  universalBookLink?: UniversalBookLinkSettings;
}

export interface LandingPagesResponse {
  landingPages: LandingPage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const landingPageApi = {
  // Get all landing pages for the authenticated user
  getLandingPages: async (params?: {
    page?: number;
    limit?: number;
    bookId?: string;
    isActive?: boolean;
  }): Promise<LandingPagesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.bookId) queryParams.append("bookId", params.bookId);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const response = await api.get(`/landing-pages?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single landing page by ID
  getLandingPage: async (id: string): Promise<LandingPage> => {
    const response = await api.get(`/landing-pages/${id}`);
    return response.data;
  },

  // Create a new landing page
  createLandingPage: async (data: any): Promise<LandingPage> => {
    const response = await api.post("/landing-pages", data);
    return response.data;
  },

  // Update a landing page
  updateLandingPage: async (
    id: string,
    data: Partial<CreateLandingPageData>
  ): Promise<LandingPage> => {
    const response = await api.put(`/landing-pages/${id}`, data);
    return response.data;
  },

  // Delete a landing page
  deleteLandingPage: async (id: string): Promise<void> => {
    await api.delete(`/landing-pages/${id}`);
  },

  // Get landing page analytics
  getLandingPageAnalytics: async (id: string): Promise<any> => {
    const response = await api.get(`/landing-pages/${id}/analytics`);
    return response.data;
  },

  // Publish/unpublish a landing page
  updateLandingPageStatus: async (
    id: string,
    isActive: boolean
  ): Promise<LandingPage> => {
    const response = await api.put(`/landing-pages/${id}`, { isActive });
    return response.data;
  },
};
