"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Grid } from "lucide-react";
import { PDFPageNavigatorProps } from "./types";

const PDFPageNavigator: React.FC<PDFPageNavigatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [showThumbnails, setShowThumbnails] = useState(false);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber = parseInt(e.target.value);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(e.currentTarget.value);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      }
    }
  };

  const goToFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const renderThumbnails = () => {
    const thumbnails: React.ReactElement[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      thumbnails.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-16 h-20 border rounded-lg flex flex-col items-center justify-center text-xs transition-colors ${
            i === currentPage
              ? "bg-blue-100 border-blue-300 text-blue-600"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FileText size={16} />
          <span className="mt-1">{i}</span>
        </button>
      );
    }

    return thumbnails;
  };

  return (
    <div className="space-y-4">
      {/* Page Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Page Navigation
        </h3>

        {/* Page Controls */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToFirstPage}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="First Page"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={handlePageInputChange}
              onKeyPress={handleKeyPress}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm"
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={goToLastPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("single")}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === "single"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid size={14} className="inline mr-1" />
            Grid
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Thumbnails</h3>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            {showThumbnails ? "Hide" : "Show"}
          </button>
        </div>

        {showThumbnails && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {renderThumbnails()}
          </div>
        )}
      </div>

      {/* Page Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Page Info</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Current Page: {currentPage}</div>
          <div>Total Pages: {totalPages}</div>
          <div>View Mode: {viewMode}</div>
        </div>
      </div>
    </div>
  );
};

export default PDFPageNavigator;
