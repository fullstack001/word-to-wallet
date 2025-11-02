import React from "react";
import { MediaType, MediaSource } from "../../services/mediaService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface MediaFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: MediaType | "all";
  setSelectedType: (type: MediaType | "all") => void;
  selectedSource: MediaSource | "all";
  setSelectedSource: (source: MediaSource | "all") => void;
  onFilterChange: () => void;
}

export default function MediaFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedSource,
  setSelectedSource,
  onFilterChange,
}: MediaFiltersProps) {
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onFilterChange();
  };

  const handleTypeChange = (type: MediaType | "all") => {
    setSelectedType(type);
    onFilterChange();
  };

  const handleSourceChange = (source: MediaSource | "all") => {
    setSelectedSource(source);
    onFilterChange();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        value={selectedType}
        onChange={(e) => handleTypeChange(e.target.value as MediaType | "all")}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Types</option>
        <option value={MediaType.IMAGE}>Images</option>
        <option value={MediaType.AUDIO}>Audio</option>
        <option value={MediaType.VIDEO}>Videos</option>
      </select>
      <select
        value={selectedSource}
        onChange={(e) =>
          handleSourceChange(e.target.value as MediaSource | "all")
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Sources</option>
        <option value={MediaSource.UPLOADED}>Uploaded</option>
        <option value={MediaSource.GENERATED}>Generated</option>
      </select>
    </div>
  );
}

