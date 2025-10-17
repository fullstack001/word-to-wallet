# EPUB Prompt Architect Integration

## Overview

The EPUB Prompt Architect is a comprehensive AI-powered system integrated into WordToWallet that generates high-quality, structured prompts for EPUB3 content creation. It follows strict compliance rules and supports multiple content types and platform integrations.

## Features

### 🤖 AI Prompt Generation

- **Strict Native Blocks**: Generates EPUB3-compliant prompts using only `CREATE SECTION`, `ADD TEXT H1`, and `ADD PARAGRAPH` commands
- **ASCII Compliance**: All generated content is ASCII-only with no emojis or special characters
- **Real-time Validation**: Instant feedback on prompt structure and compliance
- **Multiple Content Types**: Support for educational, promotional, tutorial, auction, delivery, sales, and marketing content

### 🎬 Video Tutorial Generation

- **Script Generation**: Creates detailed video scripts for tutorials and walkthroughs
- **Storyboard Creation**: Generates visual storyboards with scene descriptions and timing
- **Open Source Tools**: Links to tools like Open-Sora, Text2Video-Zero, and ModelScope T2V
- **Production Tips**: Built-in guidance for video creation and editing

### 🏢 WordToWallet Platform Integration

- **Auction Marketplace**: Templates for live bidding events and auction content
- **Digital Book Delivery**: Content for upload portals and delivery systems
- **Direct Sales**: Promotional content for sales pages and order management
- **Marketing Automation**: Email campaigns and social media integration content

## Components

### AIPromptGenerator

Main component that provides:

- Content type selection (7 different types)
- Prompt generation with validation
- Copy to clipboard functionality
- One-click prompt application

### VideoTutorialGenerator

Specialized component for:

- Video script generation
- Storyboard creation
- Open source tool recommendations
- Production guidance

### GPTService

Backend service that:

- Generates content-specific templates
- Validates Strict Native Blocks compliance
- Sanitizes text for ASCII compliance
- Provides mock responses (ready for OpenAI API integration)

## Usage

### Basic Prompt Generation

1. Select content type (Educational, Promotional, Tutorial, etc.)
2. Click "Generate Prompt"
3. Review validation results
4. Use "Use This Prompt" to apply directly to chapter

### Video Content Creation

1. Click "Video Tools" button
2. Generate script and storyboard
3. Copy content for video production
4. Use recommended open source tools

### Platform-Specific Content

- **Auction**: Live bidding events and marketplace content
- **Delivery**: Digital book delivery and analytics
- **Sales**: Direct sales and revenue tracking
- **Marketing**: Email campaigns and automation

## Strict Native Blocks Compliance

All generated prompts follow the EPUB Prompt Architect contract:

```
CREATE SECTION: Section Name
ADD TEXT H1: Heading Text
ADD PARAGRAPH: Paragraph content here.
ADD PARAGRAPH: Additional paragraph content.
```

### Validation Rules

- ✅ Only allowed commands: `CREATE SECTION`, `ADD TEXT H1`, `ADD PARAGRAPH`
- ✅ ASCII-only content (no emojis or special characters)
- ✅ Proper command formatting with colons
- ✅ Logical heading structure
- ✅ No disallowed characters or syntax

## Integration Points

### ChaptersForm Integration

The AI Prompt Generator is seamlessly integrated into the chapter creation workflow:

- Appears in Strict Native Blocks mode
- Uses chapter title and description as context
- Applies generated prompts directly to instructions

### Future OpenAI Integration

The system is ready for OpenAI API integration:

- Uncomment the API call section in `gptService.ts`
- Add your OpenAI API key
- Configure the `/api/gpt/generate` endpoint

## Content Templates

### Educational Content

- Introduction sections
- Core concepts
- Practical applications
- Advanced topics

### Promotional Content

- Main offers
- Key benefits
- Call to action sections

### Platform-Specific Content

- **Auction**: Marketplace features, bidding tools, getting started
- **Delivery**: Platform capabilities, analytics dashboard
- **Sales**: Business tools, revenue optimization
- **Marketing**: Campaign management, analytics insights

## Video Production Workflow

1. **Script Generation**: Create detailed narration scripts
2. **Storyboard Creation**: Plan visual sequences and timing
3. **Tool Selection**: Choose from recommended open source tools
4. **Production**: Follow generated guidance for video creation
5. **Integration**: Embed videos in EPUB content

## Open Source Video Tools

- **Open-Sora**: Text-to-video generation
- **Text2Video-Zero**: Zero-shot video creation
- **ModelScope T2V**: Alibaba's text-to-video model
- **RunwayML**: AI-powered video editing

## Best Practices

### Prompt Generation

- Use descriptive chapter titles and descriptions
- Select appropriate content type for your audience
- Review validation results before applying prompts
- Customize generated content as needed

### Video Creation

- Follow the generated storyboard for consistent flow
- Keep scenes under 30 seconds for engagement
- Add captions and text overlays for accessibility
- Record in 1080p or higher for professional quality

### EPUB3 Compliance

- All generated content is EPUB3-ready
- Follows accessibility guidelines
- Uses semantic HTML structure
- Optimized for various reading devices

## Future Enhancements

- OpenAI API integration for real GPT-4 generation
- Custom template creation and management
- Advanced video editing integration
- Multi-language support
- Analytics and performance tracking

## Support

For questions or issues with the EPUB Prompt Architect:

- Check validation results for compliance issues
- Review generated content for accuracy
- Use the video tools for multimedia content
- Follow the provided best practices

The EPUB Prompt Architect is designed to streamline content creation while maintaining the highest standards of EPUB3 compliance and accessibility.
