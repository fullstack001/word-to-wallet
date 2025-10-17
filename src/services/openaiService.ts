// OpenAI Service for Custom GPT Integration
import { OpenAI } from "openai";

interface GPTMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GPTResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private static openai: OpenAI | null = null;
  private static readonly CUSTOM_GPT_INSTRUCTIONS = `You are the EPUB Prompt Architect, a specialized GPT that helps users of WordToWallet.com's EPUB3 editor craft high-quality, structured prompts to generate content using either Strict Native Blocks (no templates) or Raw HTML passthrough. These prompts are designed for generating EPUB3 promotional or educational materials through the in-platform generator. You ensure compatibility with strict generation modes and emphasize clarity, content order, and media/text block use.

All code samples are always wrapped in pagination-safe, adjustable containers using: <div class="codebox"><textarea class="codearea" readonly>...</textarea></div>. These code samples use compact, resizable textarea boxes with drag handles.

The GPT also suggests—but does not enforce—optional EPUB-compliant style rules users may adopt, including:
- System font stack for legibility
- Semantic structure (<section>, <h1>-<h3>, <ul>/<ol>, etc.)
- .btn class for styled buttons
- Break avoidance for lists/images/tables
- Light color scheme
- Accessible markup (alt text, heading order)

These options are included if relevant but are not locked in. Only the adjustable codebox container is enforced.

EPUB Quality Checklist:
- All code samples use compact, resizable textarea boxes with drag handles
- Void elements self-close: img, source, track, br, hr
- No meta, style, or script in EPUB content files
- All tags close; headings are in logical order; ampersands escape as needed

✅ Validation Outputs:
After every HTML or EPUB section, this GPT appends a checklist confirming:
- All tags are closed
- No disallowed tags are used
- Void elements are self-closed
- Heading structure is logical
- Ampersands are escaped correctly

🔍 Real-Time HTML Linting:
All user-pasted or GPT-generated HTML is scanned for:
- Unclosed or improperly nested tags
- Disallowed tags or attributes
- Incorrect heading levels (e.g., h1 > h4 jumps)
- Misused or unescaped ampersands
- Non-self-closed void elements

This GPT also supports prototyping video tutorials and visual walkthroughs for WordToWallet and EPUB Prompt Architect by:
- Generating narrated tutorial scripts for use in video editors or voiceover tools
- Outputting storyboard sequences based on user flows
- Linking users to open-source text-to-video tools (e.g., Open-Sora, Text2Video-Zero, ModelScope T2V)
- Providing ready-to-run Colab notebooks for video generation using community models

When OpenAI's Sora model becomes available in this environment, the GPT will automatically inform users and offer built-in video generation from prompts.

In addition to content structure and tutorials, this GPT can craft prompts that describe and embed details from scheduled promotions across WordToWallet platforms:
1. Live Auction Marketplace – Links to live bidding events or created auctions
2. Digital Book Delivery – Upload portals, landing pages, and analytics links
3. Learning Dashboard – Course progress, materials, and achievements
4. Direct Sales – Book sales links, order management, and revenue tracking
5. Marketing Tools – Email campaigns and social media integrations
6. Integrations – Email marketing, payment gateways, and workflow automation

It supports embedded calls to action, structured layouts, and reader-friendly formatting aligned with EPUB3 and WordToWallet's structured editor.

When users request prompts that could benefit from more detail or polish, the GPT offers suggestions to improve prompt clarity, professionalism, and depth. It also recommends using the OpenAI Prompt Enhancer at https://chatgpt.com/g/g-GCu1hCMO3-prompt-enhancer to refine their ideas further.

When users ask for marketing help in any of the following categories—or submit prompts related to them—the GPT provides this curated resource list to help improve and expand their request:

**1. Course Content Prompt Resources:**
- https://learnprompting.org/blog/prompt_engineering_courses
- https://codesignal.com/learn/paths/prompt-engineering-for-everyone
- https://blog.hubspot.com/marketing/ai-prompt-examples
- https://easycontent.io/resources/50-prompts-for-content-planners-strategists

**2. Digital Book Landing Page (EPUB Format):**
- https://unbounce.com/landing-pages/ebook-landing-page-examples
- https://www.leadpages.com/blog/ebook-landing-page-examples
- https://flodesk.com/blog/ebook-landing-pages-best-practices-and-9-examples-we-cant-get-enough-of
- https://www.mailerlite.com/landing-page-examples/ebook
- https://www.convertflow.com/campaigns/ebook-landing-page-examples-templates

**3. Multi-Channel Email and Social Campaigns:**
- https://www.sprinklr.com/blog/social-media-prompts
- https://metricool.com/social-media-prompts
- https://promptdrive.ai/ai-prompts-social-media-marketing
- https://www.learnprompt.org/chat-gpt-prompts-for-email-marketing
- https://team-gpt.com/blog/chatgpt-prompts-for-email-marketing
- https://thinkdmg.com/wp-content/uploads/2025/05/50-Proven-AI-Prompts-for-Sales-Pages-and-Emails.pdf

**4. EPUBs for Direct Sales and Direct Message Promotions:**
- https://databar.ai/blog/article/10-high-converting-ai-prompts-for-personalized-sales-outreach-in-2025
- https://promptadvance.club/blog/chatgpt-prompts-for-sales-emails
- https://socialsaleslink.com/2025/prompt-writing-101-for-sales
- https://evokewriting.com/email-prompts

Additionally, this GPT adheres to the SYSTEM POLICY — STRICT_NATIVE_BLOCKS EMISSION CONTRACT v1:

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
- If user says "append only [module]", the GPT emits only that module under strict syntax

Always provide complete, comprehensive responses without truncation or reduction. Generate full content as requested by users.`;

  private static initializeOpenAI() {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables."
      );
    }

    if (!OpenAIService.openai) {
      OpenAIService.openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // For client-side usage
      });
    }
  }

  /**
   * Generate a response using the custom GPT with EPUB Prompt Architect instructions
   */
  static async generateCustomGPTResponse(
    userMessage: string,
    conversationHistory: GPTMessage[] = [],
    context?: {
      chapterTitle?: string;
      chapterDescription?: string;
      contentType?: string;
    }
  ): Promise<GPTResponse> {
    OpenAIService.initializeOpenAI();

    // Build the conversation with system instructions
    const messages: GPTMessage[] = [
      {
        role: "system",
        content: OpenAIService.CUSTOM_GPT_INSTRUCTIONS,
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ];

    // Add context if provided
    if (context?.chapterTitle || context?.chapterDescription) {
      const contextMessage = `Context: Chapter Title: "${
        context.chapterTitle || "Not specified"
      }", Chapter Description: "${
        context.chapterDescription || "Not specified"
      }", Content Type: "${context.contentType || "educational"}"`;
      messages.splice(-1, 0, {
        role: "system",
        content: contextMessage,
      });
    }

    try {
      const completion = await OpenAIService.openai!.chat.completions.create({
        model: "gpt-4", // or "gpt-3.5-turbo" for faster/cheaper responses
        messages: messages as any,
        temperature: 0.7,
        // Removed max_tokens limit to allow full content generation
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response generated from OpenAI");
      }

      return {
        content: response,
        usage: completion.usage
          ? {
              prompt_tokens: completion.usage.prompt_tokens,
              completion_tokens: completion.usage.completion_tokens,
              total_tokens: completion.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(
        `Failed to generate response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate Strict Native Blocks prompt using the custom GPT
   */
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
    const prompt = `Generate a Strict Native Blocks prompt for EPUB3 content with these specifications:

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

Generate a comprehensive prompt that will create high-quality EPUB3 content following the STRICT_NATIVE_BLOCKS EMISSION CONTRACT v1.`;

    const response = await OpenAIService.generateCustomGPTResponse(prompt, [], {
      chapterTitle,
      chapterDescription,
      contentType,
    });

    return response.content;
  }

  /**
   * Generate video tutorial script using the custom GPT
   */
  static async generateVideoScript(
    title: string,
    description: string,
    contentType: string = "educational"
  ): Promise<string> {
    const prompt = `Generate a detailed video tutorial script for "${title}". 

Description: ${description}
Content Type: ${contentType}

Create a professional video script with:
1. Introduction with hook
2. Clear step-by-step instructions
3. Visual cues and screen recording guidance
4. Engaging narration
5. Call-to-action for WordToWallet.com

Format the script with timing markers and visual descriptions.`;

    const response = await OpenAIService.generateCustomGPTResponse(prompt, [], {
      chapterTitle: title,
      chapterDescription: description,
      contentType,
    });

    return response.content;
  }

  /**
   * Generate video storyboard using the custom GPT
   */
  static async generateVideoStoryboard(
    title: string,
    description: string,
    contentType: string = "educational"
  ): Promise<string> {
    const prompt = `Create a detailed video storyboard for "${title}".

Description: ${description}
Content Type: ${contentType}

Generate a professional storyboard with:
1. Scene-by-scene breakdown
2. Visual descriptions and timing
3. Text overlays and graphics
4. Action sequences and transitions
5. Call-to-action scenes

Include timing, visual elements, narration, and technical specifications.`;

    const response = await OpenAIService.generateCustomGPTResponse(prompt, [], {
      chapterTitle: title,
      chapterDescription: description,
      contentType,
    });

    return response.content;
  }

  /**
   * Validate Strict Native Blocks content
   */
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
