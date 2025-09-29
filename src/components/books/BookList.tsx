"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  BookOpenIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  status: string;
  uploadDate: string;
  fileSize: number;
  pageCount?: number;
  wordCount?: number;
  coverImageUrl?: string;
}

interface BookListProps {
  books: Book[];
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

export function BookList({
  books,
  loading,
  pagination,
  onPageChange,
  onRefresh,
}: BookListProps) {
  const t = useTranslations("books");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "processing":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "uploading":
        return <CloudArrowUpIcon className="h-5 w-5 text-blue-500" />;
      case "error":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return t("statusReady");
      case "processing":
        return t("statusProcessing");
      case "uploading":
        return t("statusUploading");
      case "error":
        return t("statusError");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "uploading":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(bookId);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books/${bookId}`,
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
      console.error("Failed to delete book:", error);
      alert(t("deleteError"));
    } finally {
      setDeletingId(null);
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

  if (books.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-12 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("noBooks")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("noBooksDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {/* Cover Image or Icon */}
                <div className="flex-shrink-0">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <BookOpenIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/books/${book._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
                    >
                      {book.title}
                    </Link>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        book.status
                      )}`}
                    >
                      {getStatusIcon(book.status)}
                      <span className="ml-1">{getStatusText(book.status)}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    by {book.author}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{(book.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    {book.pageCount && <span>{book.pageCount} pages</span>}
                    {book.wordCount && (
                      <span>{book.wordCount.toLocaleString()} words</span>
                    )}
                    <span>
                      {new Date(book.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/books/${book._id}`}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t("view")}
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  href={`/books/${book._id}/edit`}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t("edit")}
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={deletingId === book._id}
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
