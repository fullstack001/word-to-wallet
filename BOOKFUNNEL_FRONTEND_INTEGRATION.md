# BookFunnel Frontend Integration

This document describes how to use the BookFunnel integration components in your frontend application.

## 🎯 Overview

The BookFunnel frontend integration provides a complete solution for delivering books to customers without requiring individual user API keys. The platform manages the BookFunnel integration centrally, and all users can benefit from it.

## 📦 Components

### 1. **BookFunnelIntegration** - Testing & Demo Component

**Location:** `src/components/delivery/BookFunnelIntegration.tsx`

**Purpose:** Test and demonstrate BookFunnel functionality

**Usage:**

```tsx
import { BookFunnelIntegration } from "@/components/delivery/BookFunnelIntegration";

<BookFunnelIntegration
  bookId="book_123"
  downloadPageId="page_abc123"
  deliveryActionId="action_xyz789"
/>;
```

**Features:**

- ✅ Check integration status
- ✅ Test API connection
- ✅ Create download links
- ✅ Trigger delivery actions
- ✅ Advanced options for custom data
- ✅ Real-time feedback and error handling

### 2. **BookFunnelDelivery** - Checkout Integration

**Location:** `src/components/checkout/BookFunnelDelivery.tsx`

**Purpose:** Deliver books after successful payment

**Usage:**

```tsx
import { BookFunnelDelivery } from "@/components/checkout/BookFunnelDelivery";

<BookFunnelDelivery
  orderData={{
    orderId: "order_123",
    customerEmail: "customer@example.com",
    customerName: "John Doe",
    bookFunnelPageId: "page_abc123",
    bookFunnelActionId: "action_xyz789",
  }}
  onDeliveryComplete={(data) => console.log("Delivery completed:", data)}
/>;
```

**Features:**

- ✅ Generate download links
- ✅ Trigger email delivery
- ✅ Success/error handling
- ✅ Customer-friendly interface

### 3. **IntegrationStatusCard** - Dashboard Widget

**Location:** `src/components/dashboard/IntegrationStatusCard.tsx`

**Purpose:** Show BookFunnel integration status on dashboard

**Usage:**

```tsx
import { IntegrationStatusCard } from "@/components/dashboard/IntegrationStatusCard";

<IntegrationStatusCard />;
```

**Features:**

- ✅ Real-time status display
- ✅ Configuration details
- ✅ Error message display
- ✅ Quick access to testing

### 4. **PlatformBookFunnelSettings** - Admin Interface

**Location:** `src/components/admin/PlatformBookFunnelSettings.tsx`

**Purpose:** Admin interface for managing platform BookFunnel integration

**Usage:**

```tsx
import { PlatformBookFunnelSettings } from "@/components/admin/PlatformBookFunnelSettings";

<PlatformBookFunnelSettings />;
```

**Features:**

- ✅ API key configuration
- ✅ Default settings management
- ✅ Connection testing
- ✅ Status monitoring

## 🚀 Pages

### 1. **Admin Platform Integrations Page**

**Location:** `src/app/[locale]/admin/platform-integrations/page.tsx`

**Purpose:** Complete admin interface for managing all platform integrations

**Features:**

- ✅ List all integrations
- ✅ Configure BookFunnel settings
- ✅ Test connections
- ✅ Delete integrations

### 2. **Book Delivery Page**

**Location:** `src/app/[locale]/delivery/bookfunnel/page.tsx`

**Purpose:** User interface for testing book delivery

**Features:**

- ✅ Book selection
- ✅ Delivery testing
- ✅ Usage instructions

## 🔧 API Integration

### Backend Endpoints

The frontend components interact with these backend endpoints:

```typescript
// Create download link
POST /api/deliveries/bookfunnel/download-link

// Trigger delivery action
POST /api/deliveries/bookfunnel/trigger-action

// Test connection
GET /api/deliveries/bookfunnel/test-connection

// Get status
GET /api/deliveries/bookfunnel/status

// Admin endpoints
GET /api/platform-integrations
POST /api/platform-integrations
GET /api/platform-integrations/bookfunnel
POST /api/platform-integrations/bookfunnel/test
DELETE /api/platform-integrations/:provider
```

### Example API Usage

```typescript
// Create download link
const response = await fetch("/api/deliveries/bookfunnel/download-link", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    downloadPageId: "page_abc123",
    buyerEmail: "customer@example.com",
    buyerName: "John Doe",
    orderId: "order_123",
  }),
});

const data = await response.json();
console.log("Download URL:", data.data.url);
```

## 🎨 Styling

All components use Tailwind CSS and follow the existing design system:

- **Colors:** Blue for primary actions, green for success, red for errors
- **Icons:** Heroicons for consistent iconography
- **Layout:** Responsive grid system
- **States:** Loading, success, error states with appropriate feedback

## 🔒 Security

- **Authentication:** All API calls require user authentication
- **Admin Access:** Platform integration management requires admin role
- **API Keys:** Never exposed in frontend code
- **Validation:** All inputs are validated on both frontend and backend

## 📱 Responsive Design

All components are fully responsive and work on:

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## 🧪 Testing

### Component Testing

```tsx
// Test the integration component
import { render, screen } from "@testing-library/react";
import { BookFunnelIntegration } from "@/components/delivery/BookFunnelIntegration";

test("renders BookFunnel integration component", () => {
  render(
    <BookFunnelIntegration bookId="test_book" downloadPageId="test_page" />
  );

  expect(screen.getByText("BookFunnel Integration")).toBeInTheDocument();
});
```

### Integration Testing

```typescript
// Test API integration
const testDownloadLink = async () => {
  const response = await fetch("/api/deliveries/bookfunnel/download-link", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${testToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      downloadPageId: "test_page",
      buyerEmail: "test@example.com",
      buyerName: "Test User",
      orderId: "test_order",
    }),
  });

  expect(response.ok).toBe(true);
  const data = await response.json();
  expect(data.data.url).toBeDefined();
};
```

## 🚀 Getting Started

### 1. **Setup Environment**

```bash
# Copy environment template
cp env.template .env.local

# Update API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure BookFunnel Integration**

1. Go to `/admin/platform-integrations`
2. Add BookFunnel integration
3. Enter your API key
4. Test the connection

### 4. **Use Components**

```tsx
// In your checkout page
import { BookFunnelDelivery } from "@/components/checkout/BookFunnelDelivery";

// In your dashboard
import { IntegrationStatusCard } from "@/components/dashboard/IntegrationStatusCard";

// For testing
import { BookFunnelIntegration } from "@/components/delivery/BookFunnelIntegration";
```

## 📚 Examples

See `src/components/examples/BookFunnelUsageExamples.tsx` for complete usage examples and code snippets.

## 🐛 Troubleshooting

### Common Issues

1. **"Integration not found" error**

   - Ensure platform integration is configured
   - Check admin has set up BookFunnel integration

2. **"API key not configured" error**

   - Admin needs to add BookFunnel API key
   - Check platform integration status

3. **"No delivery options" message**
   - Book needs `bookFunnelPageId` or `bookFunnelActionId`
   - Configure these in book settings

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG=true
```

## 🔄 Updates

The integration is designed to be easily extensible:

- **New Providers:** Add to `PlatformIntegration` model
- **New Features:** Extend component props and API endpoints
- **Custom Styling:** Override Tailwind classes
- **Additional Validation:** Add to validation schemas

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Test with the example components
4. Check browser console for errors

---

**Happy Book Delivering! 📚✨**
