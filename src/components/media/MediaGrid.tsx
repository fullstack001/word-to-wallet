import React from "react";
import { Media } from "../../services/mediaService";
import { PhotoIcon } from "@heroicons/react/24/outline";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  media: Media[];
  loading: boolean;
  onDelete: (id: string) => void;
  onCopyUrl: (url: string, id: string) => void;
  copySuccess: string | null;
}

export default function MediaGrid({
  media,
  loading,
  onDelete,
  onCopyUrl,
  copySuccess,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading media...</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No media files
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading or generating media
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {media.map((item) => {
        console.log(
          "Rendering media item:",
          item.title,
          "URL:",
          item.publicUrl
        );
        return (
          <MediaCard
            key={item._id}
            item={item}
            onDelete={onDelete}
            onCopyUrl={onCopyUrl}
            copySuccess={copySuccess}
          />
        );
      })}
    </div>
  );
}

