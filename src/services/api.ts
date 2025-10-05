import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "authToken";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// Token management utilities
export const tokenUtils = {
  get: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  set: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  remove: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  exists: (): boolean => {
    return !!tokenUtils.get();
  },
};

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = tokenUtils.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - clear token and redirect to login
        tokenUtils.remove();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Transform axios error to ApiError
      const apiError = new ApiError(
        typeof error.response?.data === "object" &&
        error.response?.data &&
        "message" in error.response.data
          ? (error.response.data as { message?: string }).message ||
            error.message ||
            "Request failed"
          : error.message || "Request failed",
        error.response?.status || 0,
        error.response?.data
      );

      return Promise.reject(apiError);
    }
  );

  return client;
};

// Create the main API client
const apiClient = createApiClient();

// Main API service class
class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request(config);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error
      );
    }
  }

  // HTTP method shortcuts
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  // File upload method
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  }

  // Download method
  async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    try {
      const response = await this.client.request({
        ...config,
        method: "GET",
        url,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Download failed",
        0,
        error
      );
    }
  }

  // Set auth token
  setAuthToken(token: string): void {
    tokenUtils.set(token);
  }

  // Remove auth token
  removeAuthToken(): void {
    tokenUtils.remove();
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return tokenUtils.exists();
  }

  // Get current token
  getAuthToken(): string | null {
    return tokenUtils.get();
  }
}

// Create and export the API service instance
export const api = new ApiService();

// Export the axios client for advanced use cases
export { apiClient };

// Export default
export default api;
