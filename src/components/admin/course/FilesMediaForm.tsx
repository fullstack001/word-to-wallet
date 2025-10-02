"use client";
import { useState } from "react";
import UploadProgress from "../../common/UploadProgress";

interface FilesMediaFormProps {
  epubCoverFile: File | null;
  onEpubCoverChange: (file: File | null) => void;
  existingCoverImage?: string | null;
  onRemoveExistingCover?: () => void;
  uploadProgress?: {
    isUploading: boolean;
    progress: number;
    status: "pending" | "uploading" | "completed" | "error";
    error?: string;
  };
  onUpdateProgress?: (
    progress: number,
    status: "pending" | "uploading" | "completed" | "error",
    error?: string
  ) => void;
}

export default function FilesMediaForm({
  epubCoverFile,
  onEpubCoverChange,
  existingCoverImage,
  onRemoveExistingCover,
  uploadProgress,
  onUpdateProgress,
}: FilesMediaFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onEpubCoverChange(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      onEpubCoverChange(null);
      setPreviewUrl(null);
    }
  };

  const removeImage = () => {
    onEpubCoverChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // If there's an existing cover image and no new file selected, remove the existing one
    if (existingCoverImage && !previewUrl && onRemoveExistingCover) {
      onRemoveExistingCover();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
        EPUB Cover Image
      </h4>

      {/* EPUB Cover Upload */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Image Preview */}
        {(previewUrl || existingCoverImage) && (
          <div className="relative">
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700">
                  {previewUrl ? "New Cover Preview" : "Current Cover Image"}
                </h5>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={previewUrl || existingCoverImage || ""}
                  alt={previewUrl ? "Cover preview" : "Current cover"}
                  className="max-w-full max-h-64 object-contain rounded border border-gray-200"
                />
              </div>
              {epubCoverFile && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {epubCoverFile.name} (
                  {(epubCoverFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {existingCoverImage && !previewUrl && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Current cover image
                </p>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {epubCoverFile && uploadProgress && (
          <div className="mt-3">
            <UploadProgress
              fileName={epubCoverFile.name}
              progress={uploadProgress.progress}
              status={uploadProgress.status}
              error={uploadProgress.error}
              size={epubCoverFile.size}
            />
          </div>
        )}

        {/* File Info */}
        {epubCoverFile && !previewUrl && !uploadProgress && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Selected:</span>{" "}
              {epubCoverFile.name}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Size: {(epubCoverFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* No cover image message */}
        {!previewUrl && !existingCoverImage && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600">
              No cover image selected. Upload an image to add a cover to your
              EPUB.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
