"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircleIcon,
  ClockIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface Book {
  _id: string;
  title: string;
  status: string;
  uploadDate: string;
  lastModified: string;
}

interface BookStatusProps {
  book: Book;
}

export function BookStatus({ book }: BookStatusProps) {
  const t = useTranslations("books");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ready":
        return {
          icon: CheckCircleIcon,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: t("statusReady"),
          description: t("statusReadyDescription"),
        };
      case "processing":
        return {
          icon: ClockIcon,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: t("statusProcessing"),
          description: t("statusProcessingDescription"),
        };
      case "uploading":
        return {
          icon: CloudArrowUpIcon,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          title: t("statusUploading"),
          description: t("statusUploadingDescription"),
        };
      case "error":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: t("statusError"),
          description: t("statusErrorDescription"),
        };
      case "deleted":
        return {
          icon: XCircleIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          title: t("statusDeleted"),
          description: t("statusDeletedDescription"),
        };
      default:
        return {
          icon: ClockIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          title: status,
          description: t("statusUnknownDescription"),
        };
    }
  };

  const statusConfig = getStatusConfig(book.status);
  const Icon = statusConfig.icon;

  return (
    <div
      className={`rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-4`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${statusConfig.color}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {statusConfig.description}
          </p>
        </div>
      </div>

      {/* Status-specific information */}
      {book.status === "processing" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t("processingStarted")}</span>
            <span>{new Date(book.uploadDate).toLocaleString()}</span>
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("processingProgress")}
            </p>
          </div>
        </div>
      )}

      {book.status === "error" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t("errorOccurred")}</span>
            <span>{new Date(book.lastModified).toLocaleString()}</span>
          </div>
          <div className="mt-2">
            <button className="text-sm text-blue-600 hover:text-blue-500">
              {t("viewErrorDetails")}
            </button>
          </div>
        </div>
      )}

      {book.status === "ready" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t("readyForUse")}</span>
            <span>{new Date(book.lastModified).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex space-x-2">
            <button className="text-sm text-blue-600 hover:text-blue-500">
              {t("download")}
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-500">
              {t("createArcCampaign")}
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>{t("uploaded")}</span>
            <span>{new Date(book.uploadDate).toLocaleString()}</span>
          </div>
          {book.lastModified !== book.uploadDate && (
            <div className="flex justify-between">
              <span>{t("lastModified")}</span>
              <span>{new Date(book.lastModified).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
