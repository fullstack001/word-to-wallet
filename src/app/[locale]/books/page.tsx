"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { BookUploadModal } from "@/components/books/BookUploadModal";
import { BookList } from "@/components/books/BookList";
import { BookFilters } from "@/components/books/BookFilters";

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

export default function BooksPage() {
  const t = useTranslations("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    genre: "",
    language: "",
    author: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.page, filters]);

  const handleBookUploaded = () => {
    setShowUploadModal(false);
    fetchBooks();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
                {t("title")}
              </h1>
              <p className="mt-2 text-gray-600">{t("subtitle")}</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t("uploadBook")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("totalBooks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pagination.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CloudArrowUpIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("readyBooks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {books.filter((book) => book.status === "ready").length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("processingBooks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {
                        books.filter((book) => book.status === "processing")
                          .length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-red-400 rounded-full"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("errorBooks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {books.filter((book) => book.status === "error").length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <BookFilters filters={filters} onFiltersChange={handleFilterChange} />

        {/* Books List */}
        <BookList
          books={books}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={fetchBooks}
        />

        {/* Upload Modal */}
        {showUploadModal && (
          <BookUploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleBookUploaded}
          />
        )}
      </div>
    </div>
  );
}
