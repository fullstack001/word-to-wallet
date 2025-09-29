"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  ShareIcon,
  LinkIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { CreateArcCampaignModal } from "@/components/arc/CreateArcCampaignModal";
import { ArcLinksList } from "@/components/arc/ArcLinksList";

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

interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
}

export default function ArcPage() {
  const t = useTranslations("arc");
  const [arcLinks, setArcLinks] = useState<ArcLink[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    bookId: "",
    expired: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchArcLinks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) => value !== "" && value !== false
          )
        ),
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/arc/links?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArcLinks(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch ARC links:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/books?status=ready&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchArcLinks();
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCampaignCreated = () => {
    setShowCreateModal(false);
    fetchArcLinks();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const getStatusStats = () => {
    const stats = {
      active: 0,
      expired: 0,
      maxDownloads: 0,
      disabled: 0,
      error: 0,
    };

    arcLinks.forEach((link) => {
      switch (link.status) {
        case "active":
          stats.active++;
          break;
        case "expired":
          stats.expired++;
          break;
        case "max_downloads_reached":
          stats.maxDownloads++;
          break;
        case "disabled":
          stats.disabled++;
          break;
        case "error":
          stats.error++;
          break;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShareIcon className="h-8 w-8 text-blue-600" />
                {t("title")}
              </h1>
              <p className="mt-2 text-gray-600">{t("subtitle")}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t("createCampaign")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <LinkIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("totalLinks")}
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
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("activeLinks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.active}
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
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("expiredLinks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.expired}
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
                  <ChartBarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("maxDownloads")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.maxDownloads}
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
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("errorLinks")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.error}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("filters")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("status")}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, status: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t("allStatuses")}</option>
                  <option value="active">{t("statusActive")}</option>
                  <option value="expired">{t("statusExpired")}</option>
                  <option value="max_downloads_reached">
                    {t("statusMaxDownloads")}
                  </option>
                  <option value="disabled">{t("statusDisabled")}</option>
                  <option value="error">{t("statusError")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("book")}
                </label>
                <select
                  value={filters.bookId}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, bookId: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t("allBooks")}</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("expired")}
                </label>
                <select
                  value={filters.expired.toString()}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      expired: e.target.value === "true",
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t("all")}</option>
                  <option value="true">{t("expiredOnly")}</option>
                  <option value="false">{t("activeOnly")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ARC Links List */}
        <ArcLinksList
          arcLinks={arcLinks}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={fetchArcLinks}
        />

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <CreateArcCampaignModal
            books={books}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCampaignCreated}
          />
        )}
      </div>
    </div>
  );
}
