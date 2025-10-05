# API Migration Guide

This guide helps you migrate existing components to use the new centralized API service.

## Overview

The new API service provides:

- Consistent token handling with `autoToken` in localStorage
- Centralized error handling
- Type-safe API calls
- Automatic token refresh and logout on 401 errors
- Consistent base URL: `http://localhost:5000/api`

## Key Changes

### 1. Token Name Change

- **Old**: `authToken` in localStorage
- **New**: `autoToken` in localStorage
- **Backward Compatibility**: Both are supported during migration

### 2. Import Changes

**Before:**

```typescript
import axios from "axios";
import { api as oldApi } from "../utils/api";
import { loginUser } from "../utils/apiUtils";
```

**After:**

```typescript
import { api, authApi, courseApi, fileApi } from "../services";
// or
import { api } from "../services/api";
import { authApi } from "../services/authApi";
```

### 3. API Call Changes

**Before (direct axios):**

```typescript
const response = await axios.get("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});
```

**After:**

```typescript
const response = await api.get("/endpoint");
// Token is automatically added
```

**Before (fetch):**

```typescript
const response = await fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});
```

**After:**

```typescript
const response = await api.get("/endpoint");
```

### 4. Response Handling

**Before:**

```typescript
const response = await apiClient.get("/endpoint");
return response.data.data; // Backend wraps data in .data
```

**After:**

```typescript
const response = await api.get("/endpoint");
return response.data; // Already unwrapped
```

### 5. Error Handling

**Before:**

```typescript
try {
  const response = await axios.get("/endpoint");
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle auth error
  }
  throw error;
}
```

**After:**

```typescript
try {
  const response = await api.get("/endpoint");
  return response.data;
} catch (error) {
  // Error is already handled by interceptors
  // 401 errors automatically logout and redirect
  throw error;
}
```

## Domain-Specific APIs

### Authentication

```typescript
import { authApi } from "../services";

// Login
const authResponse = await authApi.login({ email, password });

// Register
const authResponse = await authApi.register({ email, password, fullName });

// Logout
await authApi.logout();

// Get profile
const user = await authApi.getProfile();
```

### Courses

```typescript
import { courseApi } from "../services";

// Get subjects
const subjects = await courseApi.subjects.getAll();

// Create course
const course = await courseApi.courses.create(courseData);

// Upload file
const updatedCourse = await courseApi.courses.uploadEpub(courseId, file);
```

### Files

```typescript
import { fileApi } from "../services";

// Convert file
const result = await fileApi.convertPdfToWord(file);

// Download file
await fileApi.downloadFile(fileName, action);

// Upload with progress
const result = await fileApi.uploadEditedPDF(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Subscriptions

```typescript
import { subscriptionApi } from "../services";

// Get current subscription
const subscription = await subscriptionApi.getCurrent();

// Create subscription
const newSubscription = await subscriptionApi.create({
  paymentMethodId,
  plan: "pro",
});

// Cancel subscription
await subscriptionApi.cancel({ reason: "User requested" });
```

## Migration Steps

1. **Update imports** to use the new services
2. **Replace direct API calls** with service methods
3. **Update token references** from `authToken` to `autoToken`
4. **Simplify error handling** (interceptors handle common cases)
5. **Test thoroughly** to ensure functionality remains intact

## Backward Compatibility

During the migration period, both `authToken` and `autoToken` are supported. The system will check for both tokens in this order:

1. `autoToken` in localStorage
2. `authToken` in localStorage (backward compatibility)
3. `autoToken` in sessionStorage
4. `authToken` in sessionStorage (backward compatibility)

## Common Patterns

### File Upload with Progress

```typescript
const formData = new FormData();
formData.append("file", file);

const response = await api.upload("/upload-endpoint", formData, {
  onUploadProgress: (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(progress);
  },
});
```

### Query Parameters

```typescript
const response = await api.get("/endpoint", {
  params: {
    page: 1,
    limit: 10,
    status: "active",
  },
});
```

### Custom Headers

```typescript
const response = await api.get("/endpoint", {
  headers: {
    "Custom-Header": "value",
  },
});
```

## Testing

After migration, test:

1. Authentication flow (login/logout)
2. API calls with different HTTP methods
3. Error handling (network errors, 401, 500)
4. File uploads and downloads
5. Token refresh and expiration

## Support

If you encounter issues during migration:

1. Check the browser console for errors
2. Verify the API endpoint URLs
3. Ensure the token is being set correctly
4. Check network requests in DevTools
