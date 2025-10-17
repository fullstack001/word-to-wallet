# OpenAI Custom GPT Setup Guide

## Overview

This guide will help you set up the OpenAI Custom GPT integration for the EPUB Prompt Architect in your WordToWallet platform.

## Prerequisites

1. **OpenAI Account**: You need an active OpenAI account with API access
2. **API Key**: Generate an API key from your OpenAI dashboard
3. **Billing**: Ensure you have billing set up for API usage

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the generated API key (starts with `sk-`)

### 2. Configure Environment Variables

Add your OpenAI API key to your environment configuration:

#### For Development (.env.local)

```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

#### For Production

Set the environment variable in your hosting platform:

- **Vercel**: Add in Project Settings > Environment Variables
- **Netlify**: Add in Site Settings > Environment Variables
- **Railway**: Add in Project Variables

### 3. Custom GPT Configuration

The EPUB Prompt Architect is configured with the following custom instructions:

```
You are the EPUB Prompt Architect GPT for WordToWallet.com. You help users generate high-quality, structured prompts for EPUB3 content generation using either Strict Native Blocks or Raw HTML passthrough.

[Full instructions are embedded in the openaiService.ts file]
```

### 4. Features Available

Once configured, the custom GPT provides:

#### 📚 **EPUB3 Content Generation**

- Strict Native Blocks prompts
- Educational, promotional, and tutorial content
- Platform-specific templates (Auction, Delivery, Sales, Marketing)

#### 🎬 **Video Production**

- Tutorial scripts and storyboards
- Open-source video tool recommendations
- Production guidance and best practices

#### 🏢 **WordToWallet Integration**

- Live Auction Marketplace content
- Digital Book Delivery systems
- Direct Sales and Marketing automation

### 5. Usage Examples

#### Generate Strict Native Blocks Prompt

```
"Create a Strict Native Blocks prompt for a promotional product page about digital marketing tools"
```

#### Create Video Tutorial Script

```
"Write a video tutorial script for an EPUB walkthrough showing how to create chapters"
```

#### Generate Storyboard

```
"Storyboard a tutorial for setting up a sales page with call-to-action buttons"
```

### 6. API Costs

The integration uses GPT-4 by default. Estimated costs:

- **Input**: ~$0.03 per 1K tokens
- **Output**: ~$0.06 per 1K tokens
- **Typical conversation**: $0.10 - $0.50 per session

You can switch to GPT-3.5-turbo in `openaiService.ts` for lower costs:

```typescript
model: "gpt-3.5-turbo", // Cheaper option
```

### 7. Troubleshooting

#### Common Issues

**"OpenAI API key is not configured"**

- Check that `NEXT_PUBLIC_OPENAI_API_KEY` is set in your environment
- Restart your development server after adding the key

**"Failed to generate response"**

- Verify your API key is valid and active
- Check your OpenAI account billing status
- Ensure you have sufficient API credits

**Rate limiting errors**

- You may be hitting OpenAI's rate limits
- Consider implementing request queuing or retry logic

#### Testing the Integration

1. Go to `/gpt` in your application
2. Try the suggested prompts
3. Check browser console for any error messages
4. Verify API calls in Network tab

### 8. Security Considerations

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Implement rate limiting** on your backend if needed
- **Monitor API usage** to prevent unexpected charges

### 9. Advanced Configuration

#### Custom Model Selection

Edit `openaiService.ts` to use different models:

```typescript
model: "gpt-4-turbo-preview", // Latest GPT-4
model: "gpt-3.5-turbo",       // Faster, cheaper
```

#### Custom Parameters

Adjust temperature, max tokens, and other parameters:

```typescript
temperature: 0.7,        // Creativity level (0-1)
max_tokens: 2000,        // Response length limit
presence_penalty: 0.1,   // Reduce repetition
frequency_penalty: 0.1,  // Encourage variety
```

### 10. Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your OpenAI API key and billing status
3. Test with a simple prompt first
4. Review the OpenAI API documentation

## Next Steps

Once configured, your custom GPT will be available at:

- **Dashboard**: Click "EPUB Prompt Architect" feature card
- **Chapter Editor**: Use "GPT Chat" button in AI Prompt Generator
- **Direct Access**: Navigate to `/gpt` page

The GPT will provide intelligent, context-aware responses for all your EPUB3 content creation needs!
