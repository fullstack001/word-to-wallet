import { api } from "./api";

// Types
export interface FileData {
  fileName: string;
  action: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

// File API service
export const fileApi = {
  // Get files
  getFiles: async (): Promise<any[]> => {
    const response = await api.get("/pdf/files");
    return response.data;
  },

  // Download file
  downloadFile: async (fileName: string, action: string): Promise<void> => {
    const blob = await api.download("/pdf/download", {
      method: "POST",
      data: { fileName, action },
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Remove _time from the filename
    const sanitizedFileName = fileName.replace(/_\d+/, "");
    a.download = sanitizedFileName;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Upload edited PDF
  uploadEditedPDF: async (
    pdfFile: File,
    onProgress?: UploadProgressCallback
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const response = await api.upload("/pdf/pdf_upload", formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Delete PDF by filename
  deletePdfByFileName: async (fileName: string): Promise<void> => {
    await api.delete(`/pdf/delete-by-filename/${fileName}`);
  },

  // Convert file (generic)
  convertFile: async (
    endpoint: string,
    file: File,
    onUploadProgress?: UploadProgressCallback,
    additionalData?: Record<string, any>
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    // Add additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await api.upload(endpoint, formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Specific conversion functions
  convertJpgToPdf: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/jpg_to_pdf", file);
  },

  convertWordToPdf: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/word_to_pdf", file);
  },

  convertPdfToWord: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_word", file);
  },

  convertPdfToPng: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_png", file);
  },

  convertPngToPdf: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/png_to_pdf", file);
  },

  convertPdfToPptx: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_pptx", file);
  },

  convertPdfToJpg: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_jpg", file);
  },

  convertPdfToExcel: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_excel", file);
  },

  convertPdfToEpub: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/pdf_to_epub", file);
  },

  convertEpubToPdf: async (file: File): Promise<string> => {
    return fileApi.convertFile("/pdf/epub_to_pdf", file);
  },

  // Compress PDF
  compressPdf: async (
    file: File,
    compressionLevel: number
  ): Promise<string> => {
    const response = await fileApi.convertFile(
      "/pdf/compress_pdf",
      file,
      undefined,
      { level: compressionLevel }
    );
    // Extract just the filename from the response object
    return (response as any).file;
  },

  // Utility functions
  utils: {
    // Convert base64 to blob
    base64ToBlob: (base64Data: string): Blob => {
      const byteCharacters = atob(base64Data.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: "application/pdf" });
    },

    // Get saved PDF URL
    getSavedPdfUrl: (base64Data: string): string => {
      return base64Data; // base64 data can be used directly as URL
    },
  },
};

export default fileApi;
