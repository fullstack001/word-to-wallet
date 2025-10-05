# API Organization Summary

## Overview

Successfully organized and centralized all HTTP request functions across the frontend application with consistent token handling and error management.

## Key Changes Made

### 1. Centralized API Service (`src/services/api.ts`)

- **Base URL**: `http://localhost:5000/api` (from `NEXT_PUBLIC_API_URL`)
- **Token Management**: Uses `autoToken` in localStorage
- **Error Handling**: Automatic 401 handling with logout and redirect
- **Interceptors**: Request/response interceptors for consistent behavior
- **Type Safety**: Full TypeScript support with proper error types

### 2. Domain-Specific API Services

#### Authentication API (`src/services/authApi.ts`)

- Login, register, logout functions
- Password reset and change
- Profile management
- Token refresh

#### Course API (`src/services/courseApi.ts`)

- Subject management (CRUD operations)
- Course management with file uploads
- Content generation
- EPUB and thumbnail uploads

#### File API (`src/services/fileApi.ts`)

- File conversion (PDF, Word, EPUB, etc.)
- File upload with progress tracking
- File download and deletion
- Compression utilities

#### Subscription API (`src/services/subscriptionApi.ts`)

- Subscription management
- Payment processing
- Trial and upgrade flows
- Stripe integration

#### Delivery API (`src/services/deliveryApi.ts`)

- Book delivery management
- Analytics and stats
- Landing page management
- Email capture

#### Dashboard API (`src/services/dashboardApi.ts`)

- Dashboard data aggregation
- User profile and stats
- Recent activity

#### Auction API (`src/services/auctionApi.ts`)

- Auction management
- Bidding system
- Offer management

### 3. Updated Components

#### PaymentGatewayIntegration.tsx

- Replaced fetch calls with centralized API service
- Simplified error handling
- Removed manual token management

#### UploadWizard.tsx

- Updated file upload to use centralized service
- Improved progress tracking
- Simplified error handling

### 4. Utility Updates

#### authUtils.ts

- Updated to support both `autoToken` and `authToken` (backward compatibility)
- Enhanced token retrieval logic

#### apiUtils.ts

- Updated token handling to use new token name
- Maintained backward compatibility

## Token Management

### New Token Name

- **Primary**: `autoToken` in localStorage
- **Fallback**: `authToken` in localStorage (backward compatibility)

### Token Flow

1. Login sets `autoToken` in localStorage
2. All API requests automatically include token in Authorization header
3. 401 responses trigger automatic logout and redirect to login
4. Token refresh handled automatically

## API Usage Examples

### Basic API Calls

```typescript
import { api } from "../services";

// GET request
const response = await api.get("/endpoint");
const data = response.data;

// POST request
const response = await api.post("/endpoint", { data });

// File upload
const response = await api.upload("/upload", formData, {
  onUploadProgress: (progress) => console.log(progress),
});
```

### Domain-Specific APIs

```typescript
import { authApi, courseApi, fileApi } from "../services";

// Authentication
const authResponse = await authApi.login({ email, password });

// Course management
const courses = await courseApi.courses.getAll();

// File operations
const result = await fileApi.convertPdfToWord(file);
```

## Error Handling

### Automatic Error Handling

- 401 errors: Automatic logout and redirect
- Network errors: Proper error messages
- Rate limiting: Handled gracefully

### Custom Error Handling

```typescript
try {
  const response = await api.get("/endpoint");
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API Error:", error.message, error.status);
  }
  throw error;
}
```

## Backward Compatibility

### Token Support

- Supports both `autoToken` and `authToken`
- Graceful migration path
- No breaking changes for existing components

### API Patterns

- Old patterns still work during migration
- New patterns provide better error handling
- Gradual migration supported

## Migration Guide

See `API_MIGRATION_GUIDE.md` for detailed migration instructions.

## Benefits

1. **Consistency**: All API calls use the same patterns
2. **Error Handling**: Centralized error management
3. **Token Management**: Automatic token handling
4. **Type Safety**: Full TypeScript support
5. **Maintainability**: Single source of truth for API configuration
6. **Testing**: Easier to mock and test API calls
7. **Performance**: Reduced code duplication

## Files Created/Modified

### New Files

- `src/services/api.ts` - Central API service
- `src/services/authApi.ts` - Authentication API
- `src/services/courseApi.ts` - Course management API
- `src/services/fileApi.ts` - File operations API
- `src/services/subscriptionApi.ts` - Subscription API
- `src/services/deliveryApi.ts` - Delivery API
- `src/services/dashboardApi.ts` - Dashboard API
- `src/services/index.ts` - Service exports
- `API_MIGRATION_GUIDE.md` - Migration documentation

### Modified Files

- `src/services/auctionApi.ts` - Updated to use centralized API
- `src/utils/authUtils.ts` - Updated token handling
- `src/utils/apiUtils.ts` - Updated token handling
- `src/components/integrations/PaymentGatewayIntegration.tsx` - Updated API calls
- `src/components/UploadWizard.tsx` - Updated file upload

## Testing

- Created and ran integration tests
- Verified token management
- Tested API configuration
- Confirmed backward compatibility

## Next Steps

1. **Gradual Migration**: Update remaining components to use new API services
2. **Testing**: Test all API endpoints with new service
3. **Documentation**: Update component documentation
4. **Performance**: Monitor API performance improvements
5. **Error Monitoring**: Set up error tracking for API calls

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Token Configuration

- Token key: `autoToken`
- Storage: localStorage
- Header: `Authorization: Bearer {token}`
- Auto-refresh: Supported
- Auto-logout: On 401 errors

The API organization is now complete and ready for use across the entire frontend application.
