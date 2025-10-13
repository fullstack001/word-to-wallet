"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  getMyBooks,
  deleteBook,
  WrittenBook,
  MyBooksResponse,
  generateBook,
} from "@/utils/apiUtils";
import BookPreviewModal from "@/components/writeBook/BookPreviewModal";
import EditBookModal from "@/components/writeBook/EditBookModal";
import DeleteConfirmModal from "@/components/writeBook/DeleteConfirmModal";
import WriteBookForm from "@/components/writeBook/WriteBookForm";

export default function MyBooksPage() {
  const { navigate } = useLocalizedNavigation();
  const searchParams = useSearchParams();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Tab state - check URL parameter for initial tab
  const initialTab =
    (searchParams.get("tab") as "write" | "my-books") || "my-books";
  const [activeTab, setActiveTab] = useState<"write" | "my-books">(initialTab);

  // My Books state
  const [books, setBooks] = useState<WrittenBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState<WrittenBook | null>(null);
  const [previewBook, setPreviewBook] = useState<WrittenBook | null>(null);
  const [editBook, setEditBook] = useState<WrittenBook | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  // Write Book state
  const [isGenerating, setIsGenerating] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{
    epub?: { path: string; url: string };
    pdf?: { path: string; url: string };
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (activeTab === "my-books") {
      fetchBooks();
    }
  }, [currentPage, searchQuery, activeTab]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: MyBooksResponse = await getMyBooks(
        currentPage,
        12,
        searchQuery
      );
      setBooks(response.books);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
      "http://127.0.0.1:5000";
    const link = document.createElement("a");
    link.href = `${baseUrl}${url}`;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      setBooks(books.filter((book) => book._id !== id));
      setDeleteBookId(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Write Book handlers
  const handleGenerate = async (data: {
    title: string;
    description?: string;
    chapters: Array<{
      id: string;
      title: string;
      description: string;
      content: string;
    }>;
    format: string[];
  }) => {
    try {
      setIsGenerating(true);
      setWriteError(null);
      setGeneratedFiles(null);

      const result = await generateBook(data);
      setGeneratedFiles(result.files);

      // Switch to my-books tab and refresh the list after 2 seconds
      setTimeout(() => {
        setActiveTab("my-books");
        fetchBooks();
      }, 2000);
    } catch (err) {
      console.error("Error generating book:", err);
      setWriteError(
        err instanceof Error ? err.message : "Failed to generate book"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedFiles(null);
    setWriteError(null);
  };

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Book Management
              </h1>
              <p className="text-gray-600">
                Create new books or manage your existing collection
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("write")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "write"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Write New Book
              </div>
            </button>
            <button
              onClick={() => setActiveTab("my-books")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "my-books"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                My Books ({books.length})
              </div>
            </button>
          </div>
        </div>

        {/* Write Book Tab Content */}
        {activeTab === "write" && (
          <>
            {/* Success Message with Download Links */}
            {generatedFiles && (
              <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-green-800 mb-4">
                      Book Generated Successfully!
                    </h3>
                    <div className="space-y-3">
                      {generatedFiles.epub && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <svg
                              className="w-8 h-8 text-purple-600 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">
                                EPUB Format
                              </p>
                              <p className="text-sm text-gray-500">
                                Perfect for e-readers
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDownload(
                                generatedFiles.epub!.url,
                                "book.epub"
                              )
                            }
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Download EPUB
                          </button>
                        </div>
                      )}
                      {generatedFiles.pdf && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <svg
                              className="w-8 h-8 text-red-600 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">
                                PDF Format
                              </p>
                              <p className="text-sm text-gray-500">
                                Universal document format
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDownload(
                                generatedFiles.pdf!.url,
                                "book.pdf"
                              )
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Download PDF
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleReset}
                      className="mt-4 text-sm text-green-700 hover:text-green-800 underline"
                    >
                      Create another book
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {writeError && (
              <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{writeError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Write Book Form */}
            {!generatedFiles && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <WriteBookForm
                  onSubmit={handleGenerate}
                  loading={isGenerating}
                  error={writeError}
                />
              </div>
            )}
          </>
        )}

        {/* My Books Tab Content */}
        {activeTab === "my-books" && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books by title, description, or author..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : books.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No books yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start creating your first book to see it here
                </p>
                <button
                  onClick={() => setActiveTab("write")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Your First Book
                </button>
              </div>
            ) : (
              /* Books Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <div
                      key={book._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Book Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2">
                            {book.title}
                          </h3>
                        </div>

                        {book.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {book.description}
                          </p>
                        )}

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {book.author}
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            />
                          </svg>
                          {book.chapters.length} chapter
                          {book.chapters.length !== 1 ? "s" : ""}
                        </div>

                        <div className="text-xs text-gray-400 mb-4">
                          Created: {formatDate(book.createdAt)}
                        </div>

                        {/* Formats */}
                        <div className="flex gap-2 mb-4">
                          {book.files.epub && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              EPUB
                            </span>
                          )}
                          {book.files.pdf && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              PDF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setPreviewBook(book)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => setEditBook(book)}
                            className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {book.files.epub && (
                            <button
                              onClick={() =>
                                handleDownload(
                                  book.files.epub!.url,
                                  `${book.title}.epub`
                                )
                              }
                              className="flex-1 px-3 py-2 text-sm border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              Download EPUB
                            </button>
                          )}
                          {book.files.pdf && (
                            <button
                              onClick={() =>
                                handleDownload(
                                  book.files.pdf!.url,
                                  `${book.title}.pdf`
                                )
                              }
                              className="flex-1 px-3 py-2 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Download PDF
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteBookId(book._id)}
                          className="w-full mt-2 px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* Modals */}
      {previewBook && (
        <BookPreviewModal
          book={previewBook}
          onClose={() => setPreviewBook(null)}
          onDownload={handleDownload}
        />
      )}

      {editBook && (
        <EditBookModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={() => {
            setEditBook(null);
            fetchBooks();
          }}
        />
      )}

      {deleteBookId && (
        <DeleteConfirmModal
          bookId={deleteBookId}
          onClose={() => setDeleteBookId(null)}
          onConfirm={() => handleDelete(deleteBookId)}
        />
      )}
    </div>
  );
}
