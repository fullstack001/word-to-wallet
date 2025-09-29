"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { BookDetails } from "@/components/books/BookDetails";
import { BookStatus } from "@/components/books/BookStatus";
import { BookActions } from "@/components/books/BookActions";
import { BookJobs } from "@/components/books/BookJobs";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  language: string;
  genre?: string[];
  tags?: string[];
  fileKey: string;
  fileName: string;
  fileSize: number;
  checksum: string;
  metadata: any;
  status: string;
  uploadDate: string;
  lastModified: string;
  coverImageUrl?: string;
  pageCount?: number;
  wordCount?: number;
  readingTime?: number;
}

interface Job {
  _id: string;
  type: string;
  status: string;
  progress: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  completedAt?: string;
  error?: any;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("books");
  const [book, setBook] = useState<Book | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookId = params.id as string;

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBook(data.data);
      } else {
        setError("Book not found");
      }
    } catch (error) {
      console.error("Failed to fetch book:", error);
      setError("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookStatus = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books/${bookId}/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBook(data.data.book);
        setJobs(data.data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch book status:", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  useEffect(() => {
    if (book && (book.status === "uploading" || book.status === "processing")) {
      const interval = setInterval(fetchBookStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [book]);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;

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
        router.push("/books");
      } else {
        alert(t("deleteError"));
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert(t("deleteError"));
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books/${bookId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        window.open(data.data.downloadUrl, "_blank");
      } else {
        alert(t("downloadError"));
      }
    } catch (error) {
      console.error("Failed to download book:", error);
      alert(t("downloadError"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || t("bookNotFound")}
          </h2>
          <Link
            href="/books"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t("backToBooks")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {t("backToBooks")}
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <BookOpenIcon className="h-8 w-8 text-blue-600" />
                  {book.title}
                </h1>
                <p className="mt-1 text-gray-600">by {book.author}</p>
              </div>
            </div>
            <BookActions
              book={book}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Status */}
            <BookStatus book={book} />

            {/* Book Details */}
            <BookDetails book={book} />

            {/* Processing Jobs */}
            {jobs.length > 0 && <BookJobs jobs={jobs} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            {book.coverImageUrl && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("coverImage")}
                  </h3>
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("quickStats")}
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t("fileSize")}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {(book.fileSize / 1024 / 1024).toFixed(2)} MB
                    </dd>
                  </div>
                  {book.pageCount && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        {t("pages")}
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {book.pageCount}
                      </dd>
                    </div>
                  )}
                  {book.wordCount && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        {t("words")}
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {book.wordCount.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {book.readingTime && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        {t("readingTime")}
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {book.readingTime} {t("minutes")}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t("uploadDate")}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(book.uploadDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("actions")}
                </h3>
                <div className="space-y-3">
                  {book.status === "ready" && (
                    <button
                      onClick={handleDownload}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      {t("download")}
                    </button>
                  )}
                  <Link
                    href={`/books/${bookId}/edit`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {t("edit")}
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
