// Centralized API services
export { api, apiClient, tokenUtils, ApiError } from "./api";
export type { ApiResponse } from "./api";

// Domain-specific API services
export { authApi } from "./authApi";
export type {
  User,
  Subscription,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "./authApi";

export { courseApi } from "./courseApi";
export type {
  Subject,
  MediaFile,
  MultimediaContent,
  Chapter,
  Course,
  CreateSubjectData,
  UpdateSubjectData,
  CreateCourseData,
  UpdateCourseData,
  GenerateContentRequest,
  GenerateContentResponse,
} from "./courseApi";

export { subscriptionApi } from "./subscriptionApi";
export type {
  SubscriptionData,
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  UpgradeSubscriptionRequest,
} from "./subscriptionApi";

export { fileApi } from "./fileApi";
export type { FileData, UploadProgressCallback } from "./fileApi";

export { auctionApi } from "./auctionApi";

export { deliveryApi } from "./deliveryApi";
export type {
  BookDeliveryStats,
  Book,
  DeliveryLink,
  LandingPage,
  EmailCapture,
} from "./deliveryApi";

export { dashboardApi } from "./dashboardApi";
export type { DashboardData } from "./dashboardApi";

// Default export for convenience
export { api as default } from "./api";
