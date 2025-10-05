"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCreationWizard from "@/components/BookCreationWizard";
import { deliveryApi, Book } from "@/services/deliveryApi";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Create a UI-specific interface that extends Book but overrides some properties
interface UploadedBook extends Omit<Book, "status" | "_id"> {
  id: string; // Use id instead of _id for UI consistency
  status: "uploading" | "processing" | "completed" | "error"; // UI-specific status values
  filename?: string;
  progress?: number;
  errorMessage?: string;
  uploadedAt: string; // Use uploadedAt instead of createdAt for UI consistency
}

export default function UploadWizardPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [uploadedBooks, setUploadedBooks] = useState<UploadedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookCreationWizard, setShowBookCreationWizard] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Only fetch if we haven't already fetched
    if (!hasFetched.current) {
      hasFetched.current = true;

      const fetchUploadedBooks = async () => {
        try {
          setLoading(true);
          console.log("Fetching books from API...");

          // Fetch real data from the API
          const books = await deliveryApi.getBooks();
          console.log("Fetched books:", books);

          // Transform the API data to match our UI expectations
          const transformedBooks: UploadedBook[] = books.map((book: Book) => ({
            ...book,
            id: book._id, // Map _id to id for UI consistency
            filename: book.title, // Use title as filename for now
            uploadedAt: book.createdAt, // Map createdAt to uploadedAt
            // Map API status to UI status
            status:
              book.status === "active"
                ? "completed"
                : book.status === "processing"
                ? "processing"
                : book.status === "inactive"
                ? "error"
                : "completed",
          }));

          setUploadedBooks(transformedBooks);
        } catch (error) {
          console.error("Failed to fetch uploaded books:", error);
          // Set empty array on error to show empty state
          setUploadedBooks([]);
          // You could also show a toast notification here
        } finally {
          setLoading(false);
        }
      };

      fetchUploadedBooks();
    }
  }, [isLoggedIn, navigate]);

  const handleUploadComplete = async () => {
    // Hide the upload wizard after successful upload
    setShowBookCreationWizard(false);

    // Refresh the books list to show the newly uploaded book
    try {
      const books = await deliveryApi.getBooks();
      const transformedBooks: UploadedBook[] = books.map((book: Book) => ({
        ...book,
        id: book._id,
        filename: book.title,
        uploadedAt: book.createdAt,
        status:
          book.status === "active"
            ? "completed"
            : book.status === "processing"
            ? "processing"
            : book.status === "inactive"
            ? "error"
            : "completed",
      }));
      setUploadedBooks(transformedBooks);
    } catch (error) {
      console.error("Failed to refresh books after upload:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "processing":
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
      case "uploading":
        return (
          <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <Upload className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "error":
        return "text-red-600 bg-red-50";
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "uploading":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    return (
      parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-7xl min-h-[80vh] mx-auto px-4 py-8 mt-32">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/delivery")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Delivery Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upload Books</h1>
          <p className="text-gray-600 mt-2">
            Upload your digital books in EPUB, PDF, or audio format for
            distribution
          </p>
        </div>

        {/* Upload Button */}
        {!showBookCreationWizard && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowBookCreationWizard(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Upload className="w-5 h-5 mr-2" />
              Create New Book
            </button>
            <p className="text-gray-600 mt-2">
              Click to start creating your digital books
            </p>
          </div>
        )}

        {/* Book Creation Wizard */}
        {showBookCreationWizard && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Book
              </h2>
              <button
                onClick={() => setShowBookCreationWizard(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
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
            <BookCreationWizard
              onComplete={handleUploadComplete}
              onClose={() => setShowBookCreationWizard(false)}
            />
          </div>
        )}

        {/* Uploaded Books List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Uploaded Books
                </h2>
                <p className="text-gray-600">
                  Manage your uploaded books and track their processing status
                </p>
              </div>
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const books = await deliveryApi.getBooks();
                    const transformedBooks: UploadedBook[] = books.map(
                      (book: Book) => ({
                        ...book,
                        id: book._id,
                        filename: book.title,
                        uploadedAt: book.createdAt,
                        status:
                          book.status === "active"
                            ? "completed"
                            : book.status === "processing"
                            ? "processing"
                            : book.status === "inactive"
                            ? "error"
                            : "completed",
                      })
                    );
                    setUploadedBooks(transformedBooks);
                  } catch (error) {
                    console.error("Failed to refresh books:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            {uploadedBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books uploaded yet
                </h3>
                <p className="text-gray-600">
                  Click the "Upload New Book" button above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(book.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {book.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{book.filename || book.title}</span>
                          <span>•</span>
                          <span>{book.author || "Unknown Author"}</span>
                          <span>•</span>
                          <span>{book.fileType}</span>
                          <span>•</span>
                          <span>{formatFileSize(book.fileSize || 0)}</span>
                          <span>•</span>
                          <span>{formatDate(book.uploadedAt)}</span>
                        </div>
                        {book.status === "processing" && book.progress && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${book.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {book.progress}%
                              </span>
                            </div>
                          </div>
                        )}
                        {book.status === "error" && book.errorMessage && (
                          <p className="text-sm text-red-600 mt-1">
                            {book.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          book.status
                        )}`}
                      >
                        {book.status.charAt(0).toUpperCase() +
                          book.status.slice(1)}
                      </span>
                      {book.status === "completed" && (
                        <button
                          onClick={() => {
                            // Navigate to book management or delivery options
                            navigate(`/delivery/book/${book.id}`);
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Manage
                        </button>
                      )}
                      {book.status === "error" && (
                        <button
                          onClick={() => {
                            // Retry upload or show error details
                            console.log("Retry upload for:", book.id);
                          }}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Supported File Formats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">EPUB</h4>
              <p>Reflowable e-book format, ideal for most e-readers</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">PDF</h4>
              <p>Fixed-layout format, perfect for books with complex layouts</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Audio</h4>
              <p>MP3, M4A, and WAV formats for audiobooks</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-700">
            <p>
              <strong>File size limit:</strong> 100MB per file. For larger
              files, consider compressing or splitting your content.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
