// Test utility for OpenAI integration
import { OpenAIService } from "@/services/openaiService";

export const testOpenAIConnection = async (): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    // Test with a simple prompt
    const response = await OpenAIService.generateCustomGPTResponse(
      "Hello, can you help me create a simple Strict Native Blocks prompt for educational content?",
      [],
      {
        chapterTitle: "Test Chapter",
        chapterDescription: "This is a test chapter for OpenAI integration",
        contentType: "educational",
      }
    );

    return {
      success: true,
      message: "OpenAI connection successful!",
    };
  } catch (error) {
    return {
      success: false,
      message: "OpenAI connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const testStrictNativeBlocks = async (): Promise<{
  success: boolean;
  prompt?: string;
  message: string;
  error?: string;
}> => {
  try {
    const prompt = await OpenAIService.generateStrictNativeBlocksPrompt(
      "Introduction to Digital Marketing",
      "Learn the fundamentals of digital marketing strategies",
      "",
      "educational"
    );

    return {
      success: true,
      prompt,
      message: "Strict Native Blocks generation successful!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Strict Native Blocks generation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
