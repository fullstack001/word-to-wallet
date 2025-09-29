"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  LinkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

interface ArcLink {
  _id: string;
  bookId: string;
  code: string;
  url: string;
  campaignId?: string;
  expiresAt?: string;
  maxDownloads?: number;
  downloadsCount: number;
  status: string;
  metadata: {
    title: string;
    author: string;
    format: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArcLinksListProps {
  arcLinks: ArcLink[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function ArcLinksList({
  arcLinks,
  loading,
  pagination,
  onPageChange,
  onRefresh,
}: ArcLinksListProps) {
  const t = useTranslations("arc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "expired":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "max_downloads_reached":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "disabled":
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      case "error":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <LinkIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("statusActive");
      case "expired":
        return t("statusExpired");
      case "max_downloads_reached":
        return t("statusMaxDownloads");
      case "disabled":
        return t("statusDisabled");
      case "error":
        return t("statusError");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      case "max_downloads_reached":
        return "bg-red-100 text-red-800";
      case "disabled":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (arcLinkId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(arcLinkId);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/arc/links/${arcLinkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert(t("deleteError"));
      }
    } catch (error) {
      console.error("Failed to delete ARC link:", error);
      alert(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleShare = async (arcLink: ArcLink) => {
    const shareData = {
      title: `${arcLink.metadata.title} - ARC Download`,
      text: `Download ${arcLink.metadata.title} by ${arcLink.metadata.author}`,
      url: arcLink.url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(arcLink.url);
        alert(t("linkCopied"));
      }
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (arcLinks.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-12 text-center">
          <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("noArcLinks")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("noArcLinksDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {arcLinks.map((arcLink) => (
            <div
              key={arcLink._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(arcLink.status)}
                </div>

                {/* ARC Link Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {arcLink.metadata.title}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        arcLink.status
                      )}`}
                    >
                      {getStatusText(arcLink.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    by {arcLink.metadata.author}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {arcLink.code}
                    </span>
                    <span>
                      {arcLink.downloadsCount} {t("downloads")}
                    </span>
                    {arcLink.maxDownloads && (
                      <span>
                        / {arcLink.maxDownloads} {t("max")}
                      </span>
                    )}
                    {arcLink.expiresAt && (
                      <span>
                        {t("expires")}{" "}
                        {new Date(arcLink.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                    <span>
                      {t("created")}{" "}
                      {new Date(arcLink.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyCode(arcLink.code)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={
                    copiedCode === arcLink.code ? t("copied") : t("copyCode")
                  }
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare(arcLink)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t("share")}
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    window.open(`/arc/links/${arcLink.code}`, "_blank")
                  }
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t("view")}
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(arcLink._id)}
                  disabled={deletingId === arcLink._id}
                  className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
                  title={t("delete")}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t("showing")} {(pagination.page - 1) * pagination.limit + 1}{" "}
              {t("to")}{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              {t("of")} {pagination.total} {t("results")}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("previous")}
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {t("page")} {pagination.page} {t("of")} {pagination.pages}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
