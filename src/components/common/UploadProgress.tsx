"use client";
import React from "react";
import ProgressBar from "./ProgressBar";

interface UploadProgressProps {
  fileName: string;
  progress: number; // 0-100
  status: "uploading" | "completed" | "error" | "pending";
  error?: string;
  size?: number; // file size in bytes
  uploadedSize?: number; // uploaded size in bytes
  className?: string;
}

export default function UploadProgress({
  fileName,
  progress,
  status,
  error,
  size,
  uploadedSize,
  className = "",
}: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        );
      case "completed":
        return (
          <div className="rounded-full h-4 w-4 bg-green-500 flex items-center justify-center">
            <svg
              className="h-2 w-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="rounded-full h-4 w-4 bg-red-500 flex items-center justify-center">
            <svg
              className="h-2 w-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "pending":
        return <div className="rounded-full h-4 w-4 bg-gray-300" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "uploading":
        return "blue";
      case "completed":
        return "green";
      case "error":
        return "red";
      case "pending":
        return "gray";
      default:
        return "blue";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "completed":
        return "Upload complete";
      case "error":
        return "Upload failed";
      case "pending":
        return "Waiting...";
      default:
        return "";
    }
  };

  return (
    <div
      className={`p-3 bg-white border border-gray-200 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
            {fileName}
          </span>
        </div>
        <span className="text-xs text-gray-500">{getStatusText()}</span>
      </div>

      <ProgressBar
        progress={progress}
        color={getStatusColor() as any}
        size="sm"
        showPercentage={false}
      />

      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          {uploadedSize && size
            ? `${formatFileSize(uploadedSize)} / ${formatFileSize(size)}`
            : size
            ? formatFileSize(size)
            : ""}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
