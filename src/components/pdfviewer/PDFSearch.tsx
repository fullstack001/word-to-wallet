"use client";

import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";
import { PDFSearchProps, SearchResult } from "./types";

const PDFSearch: React.FC<PDFSearchProps> = ({
  onSearch,
  results,
  currentIndex,
  onResultSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchQuery(query);

    try {
      await onSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    // Clear search results
  };

  const goToNextResult = () => {
    if (results.length > 0 && currentIndex < results.length - 1) {
      const nextIndex = currentIndex + 1;
      onResultSelect(results[nextIndex]);
    }
  };

  const goToPreviousResult = () => {
    if (results.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      onResultSelect(results[prevIndex]);
    }
  };

  const highlightResult = (result: SearchResult) => {
    onResultSelect(result);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Search</h3>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search in PDF..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Controls */}
        {results.length > 0 && (
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousResult}
                disabled={currentIndex <= 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Result"
              >
                <ChevronUp size={16} />
              </button>

              <span className="text-xs text-gray-600">
                {currentIndex + 1} of {results.length}
              </span>

              <button
                onClick={goToNextResult}
                disabled={currentIndex >= results.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Result"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <span className="text-xs text-green-600">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </span>
          </div>
        )}

        {isSearching && (
          <div className="mt-3 text-xs text-gray-500">Searching...</div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Search Results
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={`${result.page}-${index}`}
                onClick={() => highlightResult(result)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  index === currentIndex
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    Page {result.page}
                  </span>
                  <span className="text-xs text-gray-500">
                    Result {index + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {result.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Search Options
        </h3>

        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span className="text-xs text-gray-600">Case sensitive</span>
          </label>

          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span className="text-xs text-gray-600">Whole word only</span>
          </label>

          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-xs text-gray-600">
              Use regular expressions
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PDFSearch;
