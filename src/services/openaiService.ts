// OpenAI Service for Custom GPT Integration - Backend Proxy
import { apiClient } from "./api";

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
  private static readonly API_BASE = "/content-generation";

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
    try {
      const response = await apiClient.post(
        `${OpenAIService.API_BASE}/custom-gpt-response`,
        {
          userMessage,
          conversationHistory,
          context,
        }
      );

      if (response.data.success) {
        return {
          content: response.data.data.content,
          usage: response.data.data.usage,
        };
      } else {
        throw new Error(response.data.message || "Failed to generate response");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate response"
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
    try {
      const response = await apiClient.post(
        `${OpenAIService.API_BASE}/generate-prompt`,
        {
          chapterTitle,
          chapterDescription,
          currentInstructions,
          contentType,
        }
      );

      if (response.data.success) {
        return response.data.data.content;
      } else {
        throw new Error(response.data.message || "Failed to generate prompt");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate prompt"
      );
    }
  }

  /**
   * Generate video tutorial script using the custom GPT
   */
  static async generateVideoScript(
    title: string,
    description: string,
    contentType: string = "educational"
  ): Promise<string> {
    try {
      const response = await apiClient.post(
        `${OpenAIService.API_BASE}/generate-video-script`,
        {
          title,
          description,
          contentType,
        }
      );

      if (response.data.success) {
        return response.data.data.content;
      } else {
        throw new Error(
          response.data.message || "Failed to generate video script"
        );
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate video script"
      );
    }
  }

  /**
   * Generate video storyboard using the custom GPT
   */
  static async generateVideoStoryboard(
    title: string,
    description: string,
    contentType: string = "educational"
  ): Promise<string> {
    try {
      const response = await apiClient.post(
        `${OpenAIService.API_BASE}/generate-video-storyboard`,
        {
          title,
          description,
          contentType,
        }
      );

      if (response.data.success) {
        return response.data.data.content;
      } else {
        throw new Error(
          response.data.message || "Failed to generate video storyboard"
        );
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate video storyboard"
      );
    }
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
