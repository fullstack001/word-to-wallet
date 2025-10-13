import axios, { AxiosResponse, AxiosError } from "axios";

// Types and interfaces
export interface User {
  email: string;
  name?: string;
  id: string;
  cardnumber?: string;
  avatar?: string;
  isAdmin: boolean;
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

export interface FileData {
  fileName: string;
  action: string;
}

export interface SubscriptionData {
  email: string;
  plan: string;
  subscriptionId: string;
  subscriptionType: string;
}

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // Minimum 100ms between requests

const rateLimitedRequest = async (requestFn: () => Promise<any>) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return requestFn();
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const autoToken = localStorage.getItem("autoToken");
    const localToken = localStorage.getItem("authToken");
    const sessionAutoToken = sessionStorage.getItem("autoToken");
    const sessionToken = sessionStorage.getItem("authToken");
    return autoToken || localToken || sessionAutoToken || sessionToken;
  }
  return null;
};

// Authentication API functions
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { data } = response.data;
    const { user, tokens } = data;

    return {
      token: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        cardnumber: "",
        avatar: "",
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
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const registerEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/register-email",
      {
        email,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ msg?: string; message?: string }>;
    const status = axiosError.response?.status;

    if (status === 409) {
      throw new Error("409");
    } else if (status === 400) {
      throw new Error("400");
    } else {
      const errorMessage =
        axiosError.response?.data?.msg ||
        axiosError.response?.data?.message ||
        "Registration failed";
      throw new Error(errorMessage);
    }
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to send reset email";
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", { token, password });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to reset password";
    throw new Error(errorMessage);
  }
};

// File management API functions
export const getFiles = async (): Promise<any[]> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<any[]> = await api.get("/pdf/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch files", { cause: error });
  }
};

export const downloadFile = async (
  fileName: string,
  action: string,
  token: string
) => {
  try {
    const response = await fetch(
      `https://api.wordtowallet.com/api/pdf/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileName, action }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Remove _time from the filename
    const sanitizedFileName = fileName.replace(/_\d+/, "");
    a.download = sanitizedFileName;

    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("Error downloading file:", err);
    window.alert("Failed to download file.");
  }
};

export const uploadEditedPDF = async (
  pdfFile: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const response: AxiosResponse<any> = await api.post(
      "/pdf/pdf_upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading edited PDF:", error);
    throw error;
  }
};

export const deletePdfByFileName = async (fileName: string): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.delete(
      `/pdf/delete-by-filename/${fileName}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete PDF", { cause: error });
  }
};

// File conversion API functions
export const convertFile = async (
  endpoint: string,
  file: File,
  onUploadProgress?: (progress: number) => void,
  additionalData?: Record<string, any>
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response: AxiosResponse<string> = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(progress);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("File conversion failed", { cause: error });
  }
};

// Specific conversion functions
export const convertJpgToPdf = async (file: File): Promise<string> => {
  return convertFile("/pdf/jpg_to_pdf", file);
};

export const convertWordToPdf = async (file: File): Promise<string> => {
  return convertFile("/pdf/word_to_pdf", file);
};

export const convertPdfToWord = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_word", file);
};

export const convertPdfToPng = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_png", file);
};

export const convertPngToPdf = async (file: File): Promise<string> => {
  return convertFile("/pdf/png_to_pdf", file);
};

export const convertPdfToPptx = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_pptx", file);
};

export const convertPdfToJpg = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_jpg", file);
};

export const convertPdfToExcel = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_excel", file);
};

export const convertPdfToEpub = async (file: File): Promise<string> => {
  return convertFile("/pdf/pdf_to_epub", file);
};

export const convertEpubToPdf = async (file: File): Promise<string> => {
  return convertFile("/pdf/epub_to_pdf", file);
};

export const compressPdf = async (
  file: File,
  compressionLevel: number
): Promise<string> => {
  const response = await convertFile("/pdf/compress_pdf", file, undefined, {
    level: compressionLevel,
  });
  return (response as any).file;
};

// Subscription API functions
export const addSubscription = async (
  subscriptionData: SubscriptionData
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/subscription/add-subscription",
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add subscription", { cause: error });
  }
};

export const createCheckoutSession = async (
  priceId: string
): Promise<{ url: string }> => {
  try {
    const response: AxiosResponse<{ url: string }> = await api.post(
      "/create-checkout-session",
      { priceId }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create checkout session", { cause: error });
  }
};

export const cancelSubscription = async (
  immediately: boolean = false,
  reason?: string,
  feedback?: string
): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions/cancel",
      {
        immediately,
        reason,
        feedback,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to cancel subscription";
    throw new Error(errorMessage);
  }
};

export const createStripeSubscription = async (
  paymentMethodId: string,
  name: string,
  email: string,
  priceId: string
): Promise<{ subscriptionId: string; error?: any }> => {
  try {
    const response: AxiosResponse<{ subscriptionId: string; error?: any }> =
      await api.post("/subscription/create-stripe-subscription", {
        paymentMethodId,
        name,
        email,
        priceId,
      });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create stripe subscription", { cause: error });
  }
};

export const getSavedPdfUrl = (base64Data: string): string => {
  return base64Data;
};

// Admin API Types
export interface Subject {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: string;
  file?: File;
}

export interface MultimediaContent {
  images: MediaFile[];
  audio: MediaFile[];
  video: MediaFile[];
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  subject: string | Subject;
  epubFile?: string;
  epubCover?: string;
  epubMetadata?: {
    title: string;
    author: string;
    publisher?: string;
    language: string;
    description?: string;
    coverImage?: string;
    totalPages?: number;
    fileSize?: number;
    lastModified?: string;
  };
  chapters?: Chapter[];
  thumbnail?: string;
  multimediaContent?: MultimediaContent;
  isActive: boolean;
  isPublished: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectData {
  name: string;
  description?: string;
}

export interface UpdateSubjectData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  subject: string;
  chapters: Chapter[];
  cover?: File;
  audio?: File[];
  video?: File[];
  isActive?: boolean;
  isPublished?: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  subject?: string;
  chapters?: Chapter[];
  multimediaContent?: {
    audio?: MediaFile[];
    video?: MediaFile[];
  };
  isActive?: boolean;
  isPublished?: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
}

// Admin API Functions
export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Subject[] }> =
      await rateLimitedRequest(() =>
        api.get("/subjects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch subjects";
    throw new Error(errorMessage);
  }
};

export const createSubject = async (
  data: CreateSubjectData
): Promise<Subject> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Subject }> =
      await api.post("/subjects", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: string[];
    }>;
    console.error("Create subject error:", axiosError.response?.data);

    let errorMessage = "Failed to create subject";

    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.data?.errors) {
      errorMessage = axiosError.response.data.errors.join(", ");
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateSubject = async (
  id: string,
  data: UpdateSubjectData
): Promise<Subject> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Subject }> =
      await api.put(`/subjects/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to update subject";
    throw new Error(errorMessage);
  }
};

export const deleteSubject = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await api.delete(`/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete subject";
    throw new Error(errorMessage);
  }
};

export const toggleSubjectStatus = async (id: string): Promise<Subject> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Subject }> =
      await api.patch(
        `/subjects/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to toggle subject status";
    throw new Error(errorMessage);
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Course[] }> =
      await rateLimitedRequest(() =>
        api.get("/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch courses";
    throw new Error(errorMessage);
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Course }> =
      await rateLimitedRequest(() =>
        api.get(`/courses/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch course";
    throw new Error(errorMessage);
  }
};

/* -----------------------------------------------------------------------------
   CONTENT GENERATION — UPDATED FOR TWO MODES
----------------------------------------------------------------------------- */
export type GenerateContentMode = "RAW_XHTML" | "STRICT_NATIVE_BLOCKS";

export interface RawXHTMLRequest {
  mode: "RAW_XHTML";
  html: string;
}

export interface StrictNativeBlocksRequest {
  mode: "STRICT_NATIVE_BLOCKS";
  strict?: boolean; // backend defaults true
  instructions?: string; // your promo recipe etc.
  title?: string;
  description?: string;
  courseTitle?: string;
  subjectName?: string;
}

export type GenerateContentRequest =
  | RawXHTMLRequest
  | StrictNativeBlocksRequest;

export interface StrictBlocksResponse {
  mode: "STRICT_NATIVE_BLOCKS";
  blocks: Array<any>;
  html: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface RawXHTMLResponse {
  mode: "RAW_XHTML";
  content: string;
}

export type GenerateContentResponseData =
  | StrictBlocksResponse
  | RawXHTMLResponse;

export interface GenerateContentResponse {
  success: boolean;
  message: string;
  data: GenerateContentResponseData;
}

export const generateChapterContent = async (
  payload: GenerateContentRequest
): Promise<GenerateContentResponse> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<GenerateContentResponse> =
      await rateLimitedRequest(() =>
        api.post("/content-generation/generate-chapter-content", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to generate content";
    throw new Error(errorMessage);
  }
};

export const getContentGenerationStatus = async (): Promise<{
  success: boolean;
  message: string;
  data: {
    available: boolean;
    models?: any[];
    recommended?: string;
    reason?: string;
  };
}> => {
  try {
    const token = getAuthToken();
    const response = await rateLimitedRequest(() =>
      api.get("/content-generation/models-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to get generation status";
    throw new Error(errorMessage);
  }
};

export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    const token = getAuthToken();

    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("subject", data.subject);
    formData.append("chapters", JSON.stringify(data.chapters));
    formData.append("isActive", String(data.isActive ?? true));
    formData.append("isPublished", String(data.isPublished ?? false));
    if (data.googleDocLink)
      formData.append("googleDocLink", data.googleDocLink);
    if (data.googleClassroomLink)
      formData.append("googleClassroomLink", data.googleClassroomLink);

    if (data.cover) {
      formData.append("cover", data.cover);
    }

    if (data.audio && data.audio.length > 0) {
      data.audio.forEach((file) => {
        formData.append("audio", file);
      });
    }

    if (data.video && data.video.length > 0) {
      data.video.forEach((file) => {
        formData.append("video", file);
      });
    }

    const response: AxiosResponse<{ success: boolean; data: Course }> =
      await api.post("/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to create course";
    throw new Error(errorMessage);
  }
};

export const updateCourse = async (
  id: string,
  data: UpdateCourseData & {
    epubCover?: File | null;
    audio?: File[];
    video?: File[];
  }
): Promise<Course> => {
  try {
    const token = getAuthToken();

    const hasFiles =
      data.epubCover ||
      (data.audio && data.audio.length > 0) ||
      (data.video && data.video.length > 0);

    if (hasFiles) {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.subject) formData.append("subject", data.subject);
      if (data.chapters)
        formData.append("chapters", JSON.stringify(data.chapters));
      if (data.multimediaContent)
        formData.append(
          "multimediaContent",
          JSON.stringify(data.multimediaContent)
        );
      if (data.isActive !== undefined)
        formData.append("isActive", String(data.isActive));
      if (data.isPublished !== undefined)
        formData.append("isPublished", String(data.isPublished));
      if (data.googleDocLink !== undefined)
        formData.append("googleDocLink", data.googleDocLink || "");
      if (data.googleClassroomLink !== undefined)
        formData.append("googleClassroomLink", data.googleClassroomLink || "");

      if (data.epubCover) {
        formData.append("epubCover", data.epubCover);
      }

      if (data.audio && data.audio.length > 0) {
        data.audio.forEach((file) => {
          formData.append("audio", file);
        });
      }

      if (data.video && data.video.length > 0) {
        data.video.forEach((file) => {
          formData.append("video", file);
        });
      }

      const response: AxiosResponse<{ success: boolean; data: Course }> =
        await api.put(`/courses/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      return response.data.data;
    } else {
      const response: AxiosResponse<{ success: boolean; data: Course }> =
        await api.put(`/courses/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data.data;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to update course";
    throw new Error(errorMessage);
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await api.delete(`/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete course";
    throw new Error(errorMessage);
  }
};

export const toggleCoursePublishedStatus = async (
  id: string
): Promise<Course> => {
  try {
    const token = getAuthToken();
    const response: AxiosResponse<{ success: boolean; data: Course }> =
      await api.patch(
        `/courses/${id}/toggle-published`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to toggle course status";
    throw new Error(errorMessage);
  }
};

export const uploadCourseEpub = async (
  id: string,
  file: File
): Promise<Course> => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("epub", file);

    const response: AxiosResponse<{ success: boolean; data: Course }> =
      await api.post(`/courses/${id}/upload-epub`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to upload EPUB file";
    throw new Error(errorMessage);
  }
};

export const uploadCourseThumbnail = async (
  id: string,
  file: File
): Promise<Course> => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response: AxiosResponse<{ success: boolean; data: Course }> =
      await api.post(`/courses/${id}/upload-thumbnail`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to upload thumbnail";
    throw new Error(errorMessage);
  }
};

export const base64ToBlob = (base64Data: string): Blob => {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "application/pdf" });
};

// Subscription API functions
export const createTrialSubscription = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions/trial",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      "Failed to create trial subscription";
    throw new Error(errorMessage);
  }
};

export const createSubscription = async (
  paymentMethodId: string,
  plan: string = "pro"
): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions",
      {
        paymentMethodId,
        plan,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to create subscription";
    throw new Error(errorMessage);
  }
};

export const getSubscription = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.get("/subscriptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to get subscription";
    throw new Error(errorMessage);
  }
};

export const createSetupIntent = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions/setup-intent",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to create setup intent";
    throw new Error(errorMessage);
  }
};

export const upgradeTrialSubscription = async (
  plan: string = "pro"
): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions/upgrade-trial",
      {
        plan,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      "Failed to upgrade trial subscription";
    throw new Error(errorMessage);
  }
};

export const upgradeSubscriptionDirect = async (
  paymentMethodId: string,
  plan: string = "pro"
): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      "/subscriptions/upgrade-direct",
      {
        paymentMethodId,
        plan,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to upgrade subscription";
    throw new Error(errorMessage);
  }
};

// Fetch current user data with subscription
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const token = getAuthToken();

    const dashboardResponse = await api.get("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data: dashboardData } = dashboardResponse.data;
    const { subscription } = dashboardData;

    const profileResponse = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data: profileData } = profileResponse.data;
    const { user } = profileData;

    return {
      token: token || "",
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        cardnumber: "",
        avatar: "",
        isAdmin: user.role === "admin",
      },
      subscription: subscription
        ? {
            stripeCustomerId: subscription.stripeCustomerId,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            status: subscription.status,
            plan: subscription.plan,
            trialStart: subscription.trialStart,
            trialEnd: subscription.trialEnd,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
          }
        : undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch user data";
    throw new Error(errorMessage);
  }
};

// Change password function
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    await api.put(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to change password";
    throw new Error(errorMessage);
  }
};

// Write Book API functions
export interface GenerateBookData {
  title: string;
  description?: string;
  chapters: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
  }>;
  format: string[];
}

export interface GenerateBookResponse {
  title: string;
  description?: string;
  author: string;
  files: {
    epub?: { path: string; url: string };
    pdf?: { path: string; url: string };
  };
}

export const generateBook = async (
  data: GenerateBookData
): Promise<GenerateBookResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response: AxiosResponse<{
      success: boolean;
      data: GenerateBookResponse;
    }> = await api.post("/write-book/generate", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to generate book";
    throw new Error(errorMessage);
  }
};

// Written Book Management API functions
export interface WrittenBook {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  author: string;
  chapters: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
  }>;
  files: {
    epub?: { path: string; url: string; size?: number };
    pdf?: { path: string; url: string; size?: number };
  };
  format: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface MyBooksResponse {
  books: WrittenBook[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getMyBooks = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<MyBooksResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response: AxiosResponse<{
      success: boolean;
      data: MyBooksResponse;
    }> = await api.get(
      `/write-book/my-books?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch books";
    throw new Error(errorMessage);
  }
};

export const getBookById = async (id: string): Promise<WrittenBook> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response: AxiosResponse<{
      success: boolean;
      data: WrittenBook;
    }> = await api.get(`/write-book/my-books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch book";
    throw new Error(errorMessage);
  }
};

export const updateBook = async (
  id: string,
  data: Partial<GenerateBookData>
): Promise<WrittenBook> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response: AxiosResponse<{
      success: boolean;
      data: WrittenBook;
    }> = await api.put(`/write-book/my-books/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to update book";
    throw new Error(errorMessage);
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    await api.delete(`/write-book/my-books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete book";
    throw new Error(errorMessage);
  }
};
