"use client";

import React, { useState } from "react";
import {
  DocumentArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { emailCampaignService } from "@/services/emailCampaignService";

interface ReceiverUploadProps {
  campaignId: string;
  onUploadComplete: (count: number) => void;
  onClose: () => void;
}

interface UploadResult {
  success: boolean;
  count?: number;
  error?: string;
}

export default function ReceiverUpload({
  campaignId,
  onUploadComplete,
  onClose,
}: ReceiverUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await emailCampaignService.uploadReceivers(
        campaignId,
        selectedFile
      );

      if (response.success && response.data) {
        setUploadResult({
          success: true,
          count: response.data.count,
        });
        onUploadComplete(response.data.count);
      } else {
        setUploadResult({
          success: false,
          error: response.message || "Upload failed",
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        error: error.message || "Network error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Receivers
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV or Excel File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          className="sr-only"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV, XLSX up to 5MB</p>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">
                        {selectedFile.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  File Format Requirements:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• First row should contain column headers</li>
                  <li>• Must include an "email" column (case insensitive)</li>
                  <li>
                    • Optional columns: "firstName", "lastName", or custom
                    fields
                  </li>
                  <li>• Supported formats: CSV, XLSX, XLS</li>
                </ul>
              </div>

              {uploadResult && (
                <div
                  className={`rounded-md p-4 ${
                    uploadResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {uploadResult.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      {uploadResult.success ? (
                        <p className="text-sm text-green-800">
                          Successfully uploaded {uploadResult.count} receivers!
                        </p>
                      ) : (
                        <p className="text-sm text-red-800">
                          {uploadResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isUploading ? "Uploading..." : "Upload Receivers"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {uploadResult?.success ? "Done" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
