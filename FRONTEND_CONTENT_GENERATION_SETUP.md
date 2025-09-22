# Frontend Content Generation Setup Guide

This guide explains how to set up and use the frontend-only AI content generation feature for course chapters.

## 🚀 Quick Setup

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables

1. Copy `env.template` to `.env.local`:

   ```bash
   cp env.template .env.local
   ```

2. Add your OpenAI API key to `.env.local`:

   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 🎯 How It Works

### Frontend-Only Implementation

- **Direct API Calls**: Makes direct calls to OpenAI API from the browser
- **No Backend Required**: Bypasses your backend server completely
- **Real-time Generation**: Content generates directly in the browser
- **Client-side Validation**: All validation happens in the frontend

### Usage

1. **Go to**: Admin courses page
2. **Create/Edit**: A course with chapters
3. **Add**: Chapter title and description
4. **Click**: "Generate with AI" button
5. **Result**: Content generates directly in the browser

## 🔧 Technical Details

### API Configuration

```javascript
// Direct OpenAI API call
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAiApiKey}`,
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational content creator...",
      },
      {
        role: "user",
        content: `Generate detailed HTML content for "${title}"...`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  }),
});
```

### Validation Rules

- **Title**: Required, 3-200 characters
- **Description**: Required, 10-1000 characters
- **Button**: Always visible, shows errors on click

## ⚠️ Security Considerations

### API Key Exposure

- **Client-side**: API key is exposed to the browser
- **Recommendation**: Use a restricted API key with limited permissions
- **Alternative**: Consider using a proxy server for production

### Best Practices

1. **Restricted Keys**: Create API keys with limited scope
2. **Usage Limits**: Set spending limits on your OpenAI account
3. **Monitoring**: Monitor API usage in OpenAI dashboard
4. **Environment**: Use different keys for development/production

## 🛠️ Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**

   - Check if `NEXT_PUBLIC_OPENAI_API_KEY` is set in `.env.local`
   - Restart the development server after adding the key

2. **"Invalid API key"**

   - Verify the API key is correct
   - Check if the key has sufficient credits

3. **"Rate limit exceeded"**

   - Wait a moment and try again
   - Check your OpenAI account usage limits

4. **"Network error"**
   - Check your internet connection
   - Verify OpenAI API is accessible

### Error Messages

- **Validation Errors**: Shown per chapter below the generate button
- **API Errors**: Displayed with specific error details
- **Network Errors**: Generic error message with retry option

## 💰 Cost Considerations

### Pricing

- **GPT-4**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Typical Cost**: $0.01-0.05 per chapter (depending on length)
- **Monitoring**: Track usage in OpenAI dashboard

### Optimization

- **Token Limits**: Set `max_tokens: 4000` to control costs
- **Temperature**: `0.7` for balanced creativity/consistency
- **Model**: Using GPT-4 for best quality

## 🔄 Migration from Backend

### What Changed

- **Removed**: Backend API calls (`generateChapterContent`)
- **Added**: Direct OpenAI API calls
- **Simplified**: No backend dependencies
- **Enhanced**: Better error handling and validation

### Benefits

- ✅ **Faster**: No backend round-trip
- ✅ **Simpler**: No backend configuration needed
- ✅ **Direct**: Real-time content generation
- ✅ **Independent**: Works without backend server

## 🚀 Production Deployment

### Environment Variables

```env
# Production environment
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-production-key-here
NODE_ENV=production
```

### Security

- Use restricted API keys
- Set spending limits
- Monitor usage regularly
- Consider API key rotation

### Performance

- Content generates in ~2-5 seconds
- No backend server load
- Direct browser-to-OpenAI communication

## 📝 Example Usage

```typescript
// The component automatically handles:
// 1. Validation
// 2. API calls
// 3. Error handling
// 4. Content insertion

// User just needs to:
// 1. Enter title and description
// 2. Click "Generate with AI"
// 3. Review generated content
```

This frontend-only approach provides a simple, fast, and direct way to generate AI content without any backend complexity!
