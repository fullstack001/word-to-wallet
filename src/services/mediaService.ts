import { apiClient } from "./api";

export enum MediaType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
}

export enum MediaSource {
  UPLOADED = "uploaded",
  GENERATED = "generated",
}

export interface Media {
  _id: string;
  title: string;
  description?: string;
  type: MediaType;
  source: MediaSource;
  fileName: string;
  filePath: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  generatedPrompt?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  media: Media[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GenerateImageRequest {
  prompt: string;
  title?: string;
  description?: string;
  size?: "1024x1024" | "1024x1792" | "1792x1024";
}

export interface GenerateAudioRequest {
  text: string;
  title?: string;
  description?: string;
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  model?: "tts-1" | "tts-1-hd";
}

export interface UploadMediaRequest {
  file: File;
  title?: string;
  description?: string;
}

export class MediaService {
  private static readonly API_BASE = "/media";

  /**
   * Get all media files
   */
  static async getMedia(params?: {
    type?: MediaType;
    source?: MediaSource;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<MediaListResponse> {
    const response = await apiClient.get(this.API_BASE, { params });
    return response.data.data;
  }

  /**
   * Get a single media file by ID
   */
  static async getMediaById(id: string): Promise<Media> {
    const response = await apiClient.get(`${this.API_BASE}/${id}`);
    return response.data.data;
  }

  /**
   * Upload a media file
   */
  static async uploadMedia(
    request: UploadMediaRequest
  ): Promise<{ success: boolean; data: Media; message: string }> {
    const formData = new FormData();
    formData.append("file", request.file);
    if (request.title) formData.append("title", request.title);
    if (request.description) formData.append("description", request.description);

    const response = await apiClient.post(
      `${this.API_BASE}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Generate an image using OpenAI DALL-E
   */
  static async generateImage(
    request: GenerateImageRequest
  ): Promise<{ success: boolean; data: Media; message: string }> {
    const response = await apiClient.post(
      `${this.API_BASE}/generate/image`,
      request
    );
    return response.data;
  }

  /**
   * Generate audio using OpenAI TTS
   */
  static async generateAudio(
    request: GenerateAudioRequest
  ): Promise<{ success: boolean; data: Media; message: string }> {
    const response = await apiClient.post(
      `${this.API_BASE}/generate/audio`,
      request
    );
    return response.data;
  }

  /**
   * Update media metadata
   */
  static async updateMedia(
    id: string,
    updates: { title?: string; description?: string }
  ): Promise<{ success: boolean; data: Media; message: string }> {
    const response = await apiClient.put(`${this.API_BASE}/${id}`, updates);
    return response.data;
  }

  /**
   * Delete a media file
   */
  static async deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`${this.API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Get video generation suggestions
   */
  static async getVideoSuggestions(): Promise<{
    success: boolean;
    data: {
      freeMethods: Array<{
        name: string;
        description: string;
        type: string;
        website: string;
        api: boolean;
        instructions: string;
      }>;
      note: string;
    };
  }> {
    const response = await apiClient.get(`${this.API_BASE}/video-suggestions`);
    return response.data;
  }

  /**
   * Copy public URL to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }
}

