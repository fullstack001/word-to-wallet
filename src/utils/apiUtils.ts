import axios, { AxiosResponse, AxiosError } from "axios";

// Types and interfaces
export interface User {
  email: string;
  name?: string;
  id: string;
  cardnumber?: string; // Add cardnumber property
  avatar?: string;
  isAdmin: boolean;
}

export interface Subscription {
  subscriptionId: string;
  plan: string;
  subscriptionType: string;
  subscribedDate: string;
  expiryDate: string;
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
const API_BASE_URL = "https://api.wordtowallet.com/api";

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
    return localStorage.getItem("authToken");
  }
  return null;
};

// Helper function to get auth headers
// const getAuthHeaders = (): Record<string, string> => {
//   const token = getAuthToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// Authentication API functions
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );
    return response.data;
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
      // Email already exists with subscription
      const errorMessage = "409";
      throw new Error(errorMessage);
    } else if (status === 400) {
      // Bad request - email already exists without subscription
      const errorMessage = "400";
      throw new Error(errorMessage);
    } else {
      // Other errors
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

    // Add additional data if provided
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
  // Extract just the filename from the response object
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
  subscriptionId: string,
  email: string
): Promise<void> => {
  try {
    await api.post("/subscription/cancel-subscription", {
      subscriptionId,
      email,
    });
  } catch (error) {
    throw new Error("Failed to cancel subscription", { cause: error });
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
  return base64Data; // base64 data can be used directly as URL
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
