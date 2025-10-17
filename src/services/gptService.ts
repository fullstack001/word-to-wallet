interface GPTRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export class GPTService {
  private static readonly SYSTEM_PROMPT = `You are the EPUB Prompt Architect, a specialized GPT that helps users of WordToWallet.com's EPUB3 editor craft high-quality, structured prompts to generate content using either Strict Native Blocks (no templates) or Raw HTML passthrough. These prompts are designed for generating EPUB3 promotional or educational materials through the in-platform generator. You ensure compatibility with strict generation modes and emphasize clarity, content order, and media/text block use.

## CRITICAL FORMATTING RULES:
- All code samples are ALWAYS wrapped in pagination-safe, adjustable containers using: <div class="codebox"><textarea class="codearea" readonly>...</textarea></div>
- These code samples use compact, resizable textarea boxes with drag handles
- Only the adjustable codebox container is enforced

## EPUB QUALITY CHECKLIST:
- All code samples use compact, resizable textarea boxes with drag handles
- Void elements self-close: img, source, track, br, hr
- No meta, style, or script in EPUB content files
- All tags close; headings are in logical order; ampersands escape as needed

## VALIDATION OUTPUTS:
After every HTML or EPUB section, append a checklist confirming:
- All tags are closed
- No disallowed tags are used
- Void elements are self-closed
- Heading structure is logical
- Ampersands are escaped correctly

## REAL-TIME HTML LINTING:
All user-pasted or GPT-generated HTML is scanned for:
- Unclosed or improperly nested tags
- Disallowed tags or attributes
- Incorrect heading levels (e.g., h1 > h4 jumps)
- Misused or unescaped ampersands
- Non-self-closed void elements

## STRICT NATIVE BLOCKS EMISSION CONTRACT v1:
- Only outputs commands: CREATE SECTION, ADD TEXT H1, ADD PARAGRAPH (exact casing)
- Text must be ASCII only — no emojis, smart quotes, or non-ASCII characters
- Only one colon per line, immediately after the command
- One ADD TEXT H1 per section
- Long lines are wrapped across multiple ADD PARAGRAPH lines
- No disallowed characters or syntax (e.g., URLs, ampersands, slashes, or numbered lists)
- No unsupported commands (e.g., ADD IMAGE)
- Prepend a 3-line validator probe before long outputs:
  CREATE SECTION: Probe
  ADD TEXT H1: Parser Probe
  ADD PARAGRAPH: If this appears the following content will append safely.
- If output exceeds ~120 lines, it is auto-chunked into CHUNKS A, B, C, etc.
- If validation fails, it automatically retries in smaller CHUNKS
- If a line contains a disallowed token, it is rewritten for compliance
- Default mode is Ultra-Safe One-Shot. If that fails, it auto-switches to 3-Chunk Seed Pack with preflight probe in CHUNK A
- If user says "append only [module]", emit only that module under strict syntax

## VIDEO TUTORIAL SUPPORT:
You support prototyping video tutorials and visual walkthroughs for WordToWallet and EPUB Prompt Architect by:
- Generating narrated tutorial scripts for use in video editors or voiceover tools
- Outputting storyboard sequences based on user flows
- Linking users to open-source text-to-video tools (e.g., Open-Sora, Text2Video-Zero, ModelScope T2V)
- Providing ready-to-run Colab notebooks for video generation using community models

## WORDTOWALLET PLATFORM INTEGRATION:
You can craft prompts that describe and embed details from scheduled promotions across WordToWallet platforms:
1. Live Auction Marketplace – Links to live bidding events or created auctions
2. Digital Book Delivery – Upload portals, landing pages, and analytics links
3. Learning Dashboard – Course progress, materials, and achievements
4. Direct Sales – Book sales links, order management, and revenue tracking
5. Marketing Tools – Email campaigns and social media integrations
6. Integrations – Email marketing, payment gateways, and workflow automation

## MARKETING RESOURCES:
When users ask for marketing help, provide these curated resources:
**Course Content Prompt Resources:**
- https://learnprompting.org/blog/prompt_engineering_courses
- https://codesignal.com/learn/paths/prompt-engineering-for-everyone
- https://blog.hubspot.com/marketing/ai-prompt-examples
- https://easycontent.io/resources/50-prompts-for-content-planners-strategists

**Digital Book Landing Page (EPUB Format):**
- https://unbounce.com/landing-pages/ebook-landing-page-examples
- https://www.leadpages.com/blog/ebook-landing-page-examples
- https://flodesk.com/blog/ebook-landing-pages-best-practices-and-9-examples-we-cant-get-enough-of
- https://www.mailerlite.com/landing-page-examples/ebook
- https://www.convertflow.com/campaigns/ebook-landing-page-examples-templates

**Multi-Channel Email and Social Campaigns:**
- https://www.sprinklr.com/blog/social-media-prompts
- https://metricool.com/social-media-prompts
- https://promptdrive.ai/ai-prompts-social-media-marketing
- https://www.learnprompt.org/chat-gpt-prompts-for-email-marketing
- https://team-gpt.com/blog/chatgpt-prompts-for-email-marketing
- https://thinkdmg.com/wp-content/uploads/2025/05/50-Proven-AI-Prompts-for-Sales-Pages-and-Emails.pdf

**EPUBs for Direct Sales and Direct Message Promotions:**
- https://databar.ai/blog/article/10-high-converting-ai-prompts-for-personalized-sales-outreach-in-2025
- https://promptadvance.club/blog/chatgpt-prompts-for-sales-emails
- https://socialsaleslink.com/2025/prompt-writing-101-for-sales
- https://evokewriting.com/email-prompts

Always maintain professional, helpful, and structured responses that guide users toward creating high-quality EPUB3 content. Provide complete, comprehensive responses without truncation or reduction. Generate full content as requested by users.`;

  static async generateStrictNativeBlocksPrompt(
    chapterTitle: string,
    chapterDescription: string,
    currentInstructions?: string,
    contentType:
      | "promotional"
      | "educational"
      | "tutorial"
      | "auction"
      | "delivery"
      | "sales"
      | "marketing" = "educational"
  ): Promise<string> {
    try {
      const userPrompt = `Generate a Strict Native Blocks prompt for EPUB3 content with these specifications:

Context:
- Chapter Title: ${chapterTitle || "Untitled Chapter"}
- Chapter Description: ${chapterDescription || "No description provided"}
- Current Instructions: ${currentInstructions || "None"}
- Content Type: ${contentType}

Requirements:
1. Create engaging, professional content suitable for EPUB3
2. Use only CREATE SECTION, ADD TEXT H1, ADD PARAGRAPH commands
3. Ensure all text is ASCII-compliant
4. Structure content logically with clear sections
5. Make content actionable and valuable for readers
6. Include practical examples or insights where appropriate

Generate a comprehensive, complete prompt that will create high-quality EPUB3 content. Provide the full response without any truncation or reduction.`;

      const request: GPTRequest = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        // Removed max_tokens limit to allow full content generation
      };

      // For now, we'll use a mock response since we don't have OpenAI API key configured
      // In production, you would make an actual API call to OpenAI
      return this.generateMockResponse(
        chapterTitle,
        chapterDescription,
        contentType
      );

      // Uncomment this when you have OpenAI API configured:
      /*
      const response = await fetch("/api/gpt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`GPT API error: ${response.statusText}`);
      }

      const data: GPTResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.choices[0]?.message?.content || "";
      */
    } catch (error) {
      console.error("GPT Service Error:", error);
      throw new Error("Failed to generate prompt. Please try again.");
    }
  }

  private static generateMockResponse(
    title: string,
    description: string,
    contentType: string
  ): string {
    const safeTitle = this.sanitizeText(title || "Chapter Title");
    const safeDescription = this.sanitizeText(
      description || "This chapter provides valuable insights and information."
    );

    const contentTemplates = {
      promotional: this.generatePromotionalContent(safeTitle, safeDescription),
      educational: this.generateEducationalContent(safeTitle, safeDescription),
      tutorial: this.generateTutorialContent(safeTitle, safeDescription),
      auction: this.generateAuctionContent(safeTitle, safeDescription),
      delivery: this.generateDeliveryContent(safeTitle, safeDescription),
      sales: this.generateSalesContent(safeTitle, safeDescription),
      marketing: this.generateMarketingContent(safeTitle, safeDescription),
    };

    return contentTemplates[contentType] || contentTemplates.educational;
  }

  private static sanitizeText(text: string): string {
    return text
      .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
      .replace(/[&<>"']/g, "") // Remove HTML entities
      .replace(/[^\w\s.,!?-]/g, "") // Keep only safe characters
      .trim();
  }

  private static generatePromotionalContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Main Offer
ADD TEXT H1: ${title}
ADD PARAGRAPH: ${description}
ADD PARAGRAPH: Discover the exclusive benefits and features that make this offer special.
ADD PARAGRAPH: Limited time opportunity to access premium content and resources.
ADD PARAGRAPH: Join thousands of satisfied customers who have transformed their results.
CREATE SECTION: Key Benefits
ADD TEXT H1: What You Will Get
ADD PARAGRAPH: Comprehensive solution designed for maximum impact and results.
ADD PARAGRAPH: Step-by-step guidance to help you achieve your goals quickly.
ADD PARAGRAPH: Expert insights and proven strategies from industry leaders.
ADD PARAGRAPH: Ongoing support and community access for continued success.
CREATE SECTION: Call to Action
ADD TEXT H1: Get Started Today
ADD PARAGRAPH: Take advantage of this special offer before it expires.
ADD PARAGRAPH: Secure your access now and begin your transformation journey.
ADD PARAGRAPH: Join the community of successful users who made the right choice.`;
  }

  private static generateEducationalContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Introduction
ADD TEXT H1: ${title}
ADD PARAGRAPH: ${description}
ADD PARAGRAPH: This comprehensive guide will help you understand the key concepts and principles.
ADD PARAGRAPH: Each section builds upon previous knowledge for complete understanding.
ADD PARAGRAPH: Practical examples and real-world applications are included throughout.
CREATE SECTION: Core Concepts
ADD TEXT H1: Fundamental Principles
ADD PARAGRAPH: Learn the essential building blocks that form the foundation of this topic.
ADD PARAGRAPH: Understanding these concepts is crucial for advanced applications.
ADD PARAGRAPH: Clear explanations with detailed examples make complex ideas accessible.
ADD PARAGRAPH: Practice exercises help reinforce your understanding of key principles.
CREATE SECTION: Practical Applications
ADD TEXT H1: Real-World Implementation
ADD PARAGRAPH: See how these concepts apply in actual scenarios and use cases.
ADD PARAGRAPH: Step-by-step instructions guide you through implementation processes.
ADD PARAGRAPH: Common challenges and solutions are addressed with practical tips.
ADD PARAGRAPH: Best practices ensure you achieve optimal results in your projects.
CREATE SECTION: Advanced Topics
ADD TEXT H1: Taking It Further
ADD PARAGRAPH: Explore advanced techniques and optimization strategies.
ADD PARAGRAPH: Learn about emerging trends and future developments in this field.
ADD PARAGRAPH: Additional resources and references for continued learning.
ADD PARAGRAPH: Connect with experts and communities for ongoing support.`;
  }

  private static generateTutorialContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Getting Started
ADD TEXT H1: ${title}
ADD PARAGRAPH: ${description}
ADD PARAGRAPH: This tutorial will walk you through the process step by step.
ADD PARAGRAPH: No prior experience required - we will cover everything you need to know.
ADD PARAGRAPH: Follow along with the examples to get hands-on experience.
CREATE SECTION: Prerequisites
ADD TEXT H1: What You Need
ADD PARAGRAPH: Basic requirements and tools needed to complete this tutorial.
ADD PARAGRAPH: Software and hardware specifications for optimal performance.
ADD PARAGRAPH: Account setup and initial configuration steps.
ADD PARAGRAPH: Download links and installation instructions for required components.
CREATE SECTION: Step-by-Step Guide
ADD TEXT H1: Tutorial Walkthrough
ADD PARAGRAPH: Detailed instructions for each step of the process.
ADD PARAGRAPH: Screenshots and visual aids help clarify complex procedures.
ADD PARAGRAPH: Troubleshooting tips for common issues you might encounter.
ADD PARAGRAPH: Alternative methods and customization options for advanced users.
CREATE SECTION: Completion and Next Steps
ADD TEXT H1: Finishing Up
ADD PARAGRAPH: Final steps to complete your setup and verify everything works.
ADD PARAGRAPH: Testing procedures to ensure proper functionality.
ADD PARAGRAPH: Maintenance tips and best practices for ongoing use.
   ADD PARAGRAPH: Resources for further learning and advanced techniques.`;
  }

  private static generateAuctionContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Live Auction Marketplace
 ADD TEXT H1: ${title}
 ADD PARAGRAPH: ${description}
 ADD PARAGRAPH: Join our live bidding events and discover exclusive items and experiences.
 ADD PARAGRAPH: Real-time auction updates and competitive bidding opportunities.
 ADD PARAGRAPH: Secure payment processing and instant delivery for winning bids.
 CREATE SECTION: Auction Features
 ADD TEXT H1: Platform Benefits
 ADD PARAGRAPH: Advanced bidding tools and automated bid management systems.
 ADD PARAGRAPH: Comprehensive item descriptions with detailed condition reports.
 ADD PARAGRAPH: Professional authentication and verification services.
 ADD PARAGRAPH: Global shipping and insurance coverage for all purchases.
 CREATE SECTION: Getting Started
 ADD TEXT H1: Begin Bidding Today
 ADD PARAGRAPH: Create your account and start participating in live auctions.
 ADD PARAGRAPH: Browse current listings and set up bid alerts for items you want.
 ADD PARAGRAPH: Learn about bidding strategies and auction best practices.`;
  }

  private static generateDeliveryContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Digital Book Delivery
 ADD TEXT H1: ${title}
 ADD PARAGRAPH: ${description}
 ADD PARAGRAPH: Seamless upload portals and automated delivery systems for digital content.
 ADD PARAGRAPH: Advanced analytics and tracking for delivery performance.
 ADD PARAGRAPH: Customizable landing pages and branded delivery experiences.
 CREATE SECTION: Delivery Features
 ADD TEXT H1: Platform Capabilities
 ADD PARAGRAPH: Multi-format support including EPUB, PDF, and audio files.
 ADD PARAGRAPH: Automated email delivery with personalized messages.
 ADD PARAGRAPH: Download tracking and access management systems.
 ADD PARAGRAPH: Integration with major email marketing platforms.
 CREATE SECTION: Analytics Dashboard
 ADD TEXT H1: Performance Insights
 ADD PARAGRAPH: Real-time delivery statistics and engagement metrics.
 ADD PARAGRAPH: Customer behavior analysis and conversion tracking.
 ADD PARAGRAPH: A/B testing tools for optimizing delivery performance.
 ADD PARAGRAPH: Detailed reporting and export capabilities.`;
  }

  private static generateSalesContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Direct Sales Platform
 ADD TEXT H1: ${title}
 ADD PARAGRAPH: ${description}
 ADD PARAGRAPH: Streamlined order management and revenue tracking systems.
 ADD PARAGRAPH: Secure payment processing with multiple gateway options.
 ADD PARAGRAPH: Automated invoicing and customer communication tools.
 CREATE SECTION: Sales Features
 ADD TEXT H1: Business Tools
 ADD PARAGRAPH: Inventory management and stock level monitoring.
 ADD PARAGRAPH: Customer relationship management and order history.
 ADD PARAGRAPH: Sales analytics and performance reporting.
 ADD PARAGRAPH: Integration with accounting and tax software.
 CREATE SECTION: Revenue Optimization
 ADD TEXT H1: Growth Strategies
 ADD PARAGRAPH: Dynamic pricing and promotional campaign management.
 ADD PARAGRAPH: Customer segmentation and targeted marketing tools.
 ADD PARAGRAPH: Cross-selling and upselling automation features.
 ADD PARAGRAPH: Loyalty programs and customer retention systems.`;
  }

  private static generateMarketingContent(
    title: string,
    description: string
  ): string {
    return `CREATE SECTION: Marketing Automation
 ADD TEXT H1: ${title}
 ADD PARAGRAPH: ${description}
 ADD PARAGRAPH: Comprehensive email campaign management and automation tools.
 ADD PARAGRAPH: Social media integration and content scheduling systems.
 ADD PARAGRAPH: Advanced segmentation and personalization capabilities.
 CREATE SECTION: Campaign Management
 ADD TEXT H1: Marketing Tools
 ADD PARAGRAPH: Drag-and-drop email builder with responsive templates.
 ADD PARAGRAPH: Automated drip campaigns and behavioral triggers.
 ADD PARAGRAPH: A/B testing and performance optimization tools.
 ADD PARAGRAPH: Integration with major social media platforms.
 CREATE SECTION: Analytics and Insights
 ADD TEXT H1: Performance Tracking
 ADD PARAGRAPH: Real-time campaign analytics and engagement metrics.
 ADD PARAGRAPH: Customer journey mapping and conversion tracking.
 ADD PARAGRAPH: ROI analysis and marketing attribution reporting.
 ADD PARAGRAPH: Predictive analytics and customer lifetime value insights.`;
  }

  static validateStrictNativeBlocks(prompt: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const lines = prompt.split("\n").filter((line) => line.trim());

    // Check for valid commands
    const validCommands = ["CREATE SECTION", "ADD TEXT H1", "ADD PARAGRAPH"];
    const commandPattern =
      /^(CREATE SECTION|ADD TEXT H1|ADD PARAGRAPH):\s*(.*)$/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(commandPattern);

      if (!match) {
        errors.push(
          `Line ${i + 1}: Invalid command format. Expected: COMMAND: content`
        );
        continue;
      }

      const [, command, content] = match;

      if (!validCommands.includes(command)) {
        errors.push(
          `Line ${
            i + 1
          }: Invalid command "${command}". Allowed: ${validCommands.join(", ")}`
        );
      }

      // Check for non-ASCII characters
      if (/[^\x00-\x7F]/.test(content)) {
        errors.push(`Line ${i + 1}: Non-ASCII characters detected in content`);
      }

      // Check for disallowed characters
      if (/[&<>"']/.test(content)) {
        errors.push(
          `Line ${i + 1}: Disallowed characters detected (&, <, >, ", ')`
        );
      }
    }

    // Check heading structure
    const h1Count = lines.filter((line) =>
      line.startsWith("ADD TEXT H1")
    ).length;
    if (h1Count === 0) {
      warnings.push(
        "No headings found. Consider adding at least one ADD TEXT H1 command."
      );
    }

    // Check section structure
    const sectionCount = lines.filter((line) =>
      line.startsWith("CREATE SECTION")
    ).length;
    if (sectionCount === 0) {
      warnings.push(
        "No sections found. Consider adding CREATE SECTION commands."
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
