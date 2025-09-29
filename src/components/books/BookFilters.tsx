"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface BookFiltersProps {
  filters: {
    search: string;
    status: string;
    genre: string;
    language: string;
    author: string;
  };
  onFiltersChange: (filters: typeof BookFiltersProps.prototype.filters) => void;
}

export function BookFilters({ filters, onFiltersChange }: BookFiltersProps) {
  const t = useTranslations("books");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      genre: "",
      language: "",
      author: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            {t("filters")}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              {t("clearFilters")}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("status")}
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("allStatuses")}</option>
              <option value="ready">{t("statusReady")}</option>
              <option value="processing">{t("statusProcessing")}</option>
              <option value="uploading">{t("statusUploading")}</option>
              <option value="error">{t("statusError")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("language")}
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("allLanguages")}</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("author")}
            </label>
            <input
              type="text"
              placeholder={t("authorPlaceholder")}
              value={filters.author}
              onChange={(e) => handleFilterChange("author", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {showAdvanced ? t("hideAdvanced") : t("showAdvanced")}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("genre")}
                </label>
                <input
                  type="text"
                  placeholder={t("genrePlaceholder")}
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sortBy")}
                </label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="uploadDate">{t("uploadDate")}</option>
                  <option value="title">{t("title")}</option>
                  <option value="author">{t("author")}</option>
                  <option value="lastModified">{t("lastModified")}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                const filterLabels: { [key: string]: string } = {
                  search: t("search"),
                  status: t("status"),
                  genre: t("genre"),
                  language: t("language"),
                  author: t("author"),
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {filterLabels[key]}: {value}
                    <button
                      onClick={() => handleFilterChange(key, "")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
