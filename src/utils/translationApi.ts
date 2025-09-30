// Translation API utility functions
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface TranslationRequest {
  text?: string;
  htmlContent?: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  success: boolean;
  message: string;
  data: {
    originalText?: string;
    originalHtml?: string;
    translatedText?: string;
    translatedHtml?: string;
    sourceLanguage: string;
    targetLanguage: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

export interface LanguageDetectionRequest {
  text: string;
}

export interface LanguageDetectionResponse {
  success: boolean;
  message: string;
  data: {
    text: string;
    detectedLanguage: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

export interface SupportedLanguagesResponse {
  success: boolean;
  message: string;
  data: {
    languages: Array<{ code: string; name: string }>;
    total: number;
  };
}

// Translate plain text
export const translateText = async (
  request: TranslationRequest
): Promise<TranslationResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/translation/translate-text`,
    {
      text: request.text,
      targetLanguage: request.targetLanguage,
      sourceLanguage: request.sourceLanguage,
    }
  );
  return response.data;
};

// Translate HTML content
export const translateHtml = async (
  request: TranslationRequest
): Promise<TranslationResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/translation/translate-html`,
    {
      htmlContent: request.htmlContent,
      targetLanguage: request.targetLanguage,
      sourceLanguage: request.sourceLanguage,
    },
    {
      timeout: 1200000, // Increase timeout to 2 minutes (120,000 ms)
    }
  );
  return response.data;
};

// Detect language of text
export const detectLanguage = async (
  request: LanguageDetectionRequest
): Promise<LanguageDetectionResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/translation/detect-language`,
    {
      text: request.text,
    }
  );
  return response.data;
};

// Get supported languages
export const getSupportedLanguages =
  async (): Promise<SupportedLanguagesResponse> => {
    const response = await axios.get(
      `${API_BASE_URL}/translation/supported-languages`
    );
    return response.data;
  };

// Authenticated translation functions (require JWT token)
export const translateTextAuth = async (
  request: TranslationRequest
): Promise<TranslationResponse> => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/translation/translate-text-auth`,
    {
      text: request.text,
      targetLanguage: request.targetLanguage,
      sourceLanguage: request.sourceLanguage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const translateHtmlAuth = async (
  request: TranslationRequest
): Promise<TranslationResponse> => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/translation/translate-html-auth`,
    {
      htmlContent: request.htmlContent,
      targetLanguage: request.targetLanguage,
      sourceLanguage: request.sourceLanguage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const detectLanguageAuth = async (
  request: LanguageDetectionRequest
): Promise<LanguageDetectionResponse> => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/translation/detect-language-auth`,
    {
      text: request.text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
