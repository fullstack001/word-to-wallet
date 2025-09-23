// Loading utility functions and constants

export const LOADING_MESSAGES = {
  // General
  DEFAULT: "Loading...",
  PROCESSING: "Processing...",
  SAVING: "Saving...",
  UPDATING: "Updating...",
  DELETING: "Deleting...",

  // Authentication
  SIGNING_IN: "Signing in...",
  SIGNING_OUT: "Signing out...",
  REGISTERING: "Creating account...",
  VERIFYING: "Verifying...",

  // Data fetching
  LOADING_DATA: "Loading data...",
  LOADING_COURSES: "Loading courses...",
  LOADING_DASHBOARD: "Loading dashboard...",
  LOADING_PROFILE: "Loading profile...",

  // File operations
  UPLOADING: "Uploading...",
  DOWNLOADING: "Downloading...",
  GENERATING: "Generating...",

  // API operations
  FETCHING: "Fetching data...",
  SUBMITTING: "Submitting...",
  CONNECTING: "Connecting...",
} as const;

export type LoadingMessage =
  (typeof LOADING_MESSAGES)[keyof typeof LOADING_MESSAGES];

// Loading timeout configurations
export const LOADING_TIMEOUTS = {
  SHORT: 2000, // 2 seconds
  MEDIUM: 5000, // 5 seconds
  LONG: 10000, // 10 seconds
  VERY_LONG: 30000, // 30 seconds
} as const;

// Loading delay configurations
export const LOADING_DELAYS = {
  INSTANT: 0,
  FAST: 100,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Helper function to get appropriate loading message based on context
export function getLoadingMessage(context: string, action?: string): string {
  const key = action
    ? `${context.toUpperCase()}_${action.toUpperCase()}`
    : context.toUpperCase();
  return (
    LOADING_MESSAGES[key as keyof typeof LOADING_MESSAGES] ||
    LOADING_MESSAGES.DEFAULT
  );
}

// Helper function to create loading states for common operations
export function createLoadingStates() {
  return {
    // Authentication states
    auth: {
      signingIn: false,
      signingOut: false,
      registering: false,
    },

    // Data states
    data: {
      loading: false,
      saving: false,
      updating: false,
      deleting: false,
    },

    // UI states
    ui: {
      modal: false,
      sidebar: false,
      navigation: false,
    },
  };
}

// Helper function to manage loading timeouts
export function withLoadingTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = LOADING_TIMEOUTS.MEDIUM,
  timeoutMessage: string = "Request timed out"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

// Helper function to debounce loading states
export function debounceLoading(
  setLoading: (loading: boolean) => void,
  delay: number = LOADING_DELAYS.NORMAL
) {
  let timeoutId: NodeJS.Timeout;

  return (loading: boolean) => {
    clearTimeout(timeoutId);

    if (loading) {
      setLoading(true);
    } else {
      timeoutId = setTimeout(() => setLoading(false), delay);
    }
  };
}
