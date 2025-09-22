"use client";
import { useState, useRef, useCallback } from "react";
import { MediaFile } from "@/utils/apiUtils";
import { FileUploadManager } from "@/utils/fileUploadUtils";

interface MultimediaUploadProps {
  type: "image" | "audio" | "video";
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function MultimediaUpload({
  type,
  files,
  onFilesChange,
  maxFiles = 10,
  className = "",
}: MultimediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile, formatFileSize, getFileIcon } = FileUploadManager;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    []
  );

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of newFiles) {
      const error = validateFile(file, type);
      if (error) {
        alert(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // Convert File objects to MediaFile objects (without uploading)
    const mediaFiles: MediaFile[] = validFiles.map((file) => ({
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: "", // Will be set after upload
      url: "", // Will be set after upload
      uploadedAt: new Date().toISOString(),
      file: file, // Store the actual File object for later upload
    }));

    onFilesChange([...files, ...mediaFiles]);
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter((file) => file.id !== fileId));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getTypeLabel = () => {
    switch (type) {
      case "image":
        return "Images";
      case "audio":
        return "Audio Files";
      case "video":
        return "Video Files";
      default:
        return "Files";
    }
  };

  const getAcceptedTypes = () => {
    switch (type) {
      case "image":
        return "image/*";
      case "audio":
        return "audio/*";
      case "video":
        return "video/*";
      default:
        return "*/*";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {getTypeLabel()} ({files.length}/{maxFiles})
        </label>
        <button
          type="button"
          onClick={openFileDialog}
          disabled={files.length >= maxFiles}
          className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          + Add {getTypeLabel()}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={getAcceptedTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop {getTypeLabel().toLowerCase()} here, or click to
            select
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Maximum {maxFiles} files, up to 100MB each
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(file.mimeType)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700 p-1"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
