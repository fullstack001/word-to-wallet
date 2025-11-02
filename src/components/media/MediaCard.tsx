import React from "react";
import {
  Media,
  MediaType,
  MediaSource,
  MediaService,
} from "../../services/mediaService";
import {
  PhotoIcon,
  MusicalNoteIcon,
  FilmIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface MediaCardProps {
  item: Media;
  onDelete: (id: string) => void;
  onCopyUrl: (url: string, id: string) => void;
  copySuccess: string | null;
}

export default function MediaCard({
  item,
  onDelete,
  onCopyUrl,
  copySuccess,
}: MediaCardProps) {
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        return PhotoIcon;
      case MediaType.AUDIO:
        return MusicalNoteIcon;
      case MediaType.VIDEO:
        return FilmIcon;
      default:
        return PhotoIcon;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const Icon = getMediaIcon(item.type);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Media Preview */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
        {item.type === MediaType.IMAGE ? (
          <img
            src={item.publicUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error(
                "Failed to load image:",
                item.publicUrl,
                "Error:",
                e
              );
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", item.publicUrl);
            }}
          />
        ) : item.type === MediaType.VIDEO ? (
          <video
            src={item.publicUrl}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            onError={(e) => {
              console.error(
                "Failed to load video:",
                item.publicUrl,
                "Error:",
                e
              );
            }}
          />
        ) : item.type === MediaType.AUDIO ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <Icon className="w-16 h-16 text-gray-400 mb-4" />
            <audio
              src={item.publicUrl}
              controls
              className="w-full max-w-md"
              onError={(e) => {
                console.error(
                  "Failed to load audio:",
                  item.publicUrl,
                  "Error:",
                  e
                );
              }}
            />
          </div>
        ) : (
          <div className="text-center">
            <Icon className="w-16 h-16 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 capitalize">{item.type}</p>
          </div>
        )}
        {item.source === MediaSource.GENERATED && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
            AI
          </div>
        )}
      </div>

      {/* Media Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        {item.createdBy && (
          <p className="text-xs text-gray-500 mt-1">
            Created by:{" "}
            {item.createdBy.firstName && item.createdBy.lastName
              ? `${item.createdBy.firstName} ${item.createdBy.lastName}`
              : item.createdBy.email}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(item.size)}</span>
          <span className="capitalize">{item.type}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onCopyUrl(item.publicUrl, item._id)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            title="Copy public URL"
          >
            <LinkIcon className="w-4 h-4" />
            {copySuccess === item._id ? "Copied!" : "Copy URL"}
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
