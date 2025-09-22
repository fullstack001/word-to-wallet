import { MediaFile } from "./apiUtils";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export class FileUploadManager {
  static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  static readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  static readonly ALLOWED_AUDIO_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp3",
  ];
  static readonly ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  static readonly ALLOWED_EPUB_TYPES = ["application/epub+zip"];

  static validateFile(
    file: File,
    type: "image" | "audio" | "video" | "epub"
  ): string | null {
    // Check file size
    if (file.size > FileUploadManager.MAX_FILE_SIZE) {
      return `File size must be less than ${
        FileUploadManager.MAX_FILE_SIZE / (1024 * 1024)
      }MB`;
    }

    // Check file type
    let allowedTypes: string[];
    switch (type) {
      case "image":
        allowedTypes = FileUploadManager.ALLOWED_IMAGE_TYPES;
        break;
      case "audio":
        allowedTypes = FileUploadManager.ALLOWED_AUDIO_TYPES;
        break;
      case "video":
        allowedTypes = FileUploadManager.ALLOWED_VIDEO_TYPES;
        break;
      case "epub":
        allowedTypes = FileUploadManager.ALLOWED_EPUB_TYPES;
        break;
      default:
        return "Invalid file type";
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${
        file.type
      } is not allowed. Allowed types: ${allowedTypes.join(", ")}`;
    }

    return null;
  }

  static async uploadFile(
    file: File,
    type: "image" | "audio" | "video" | "epub",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validationError = FileUploadManager.validateFile(file, type);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Get auth token
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        return { success: false, error: "Authentication token not found" };
      }

      // Upload file
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || "Upload failed" };
      }

      const result = await response.json();
      return { success: true, file: result.data };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Upload failed due to network error" };
    }
  }

  static async uploadMultipleFiles(
    files: File[],
    type: "image" | "audio" | "video",
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await FileUploadManager.uploadFile(
        file,
        type,
        (progress) => {
          onProgress?.(i, progress);
        }
      );
      results.push(result);

      // If any upload fails, we might want to stop or continue based on requirements
      if (!result.success) {
        console.warn(`Upload failed for file ${file.name}:`, result.error);
      }
    }

    return results;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.startsWith("video/")) return "🎬";
    if (mimeType === "application/epub+zip") return "📚";
    return "📄";
  }

  static getFileTypeFromMime(
    mimeType: string
  ): "image" | "audio" | "video" | "epub" | "other" {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/epub+zip") return "epub";
    return "other";
  }
}

export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    type: "image" | "audio" | "video" | "epub",
    onProgress?: (progress: UploadProgress) => void
  ) => {
    return FileUploadManager.uploadFile(file, type, onProgress);
  };

  const uploadMultipleFiles = async (
    files: File[],
    type: "image" | "audio" | "video",
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ) => {
    return FileUploadManager.uploadMultipleFiles(files, type, onProgress);
  };

  const validateFile = (
    file: File,
    type: "image" | "audio" | "video" | "epub"
  ) => {
    return FileUploadManager.validateFile(file, type);
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    validateFile,
    formatFileSize: FileUploadManager.formatFileSize,
    getFileIcon: FileUploadManager.getFileIcon,
    getFileTypeFromMime: FileUploadManager.getFileTypeFromMime,
  };
};
