"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import JoditEditor from "jodit-react";
import { api } from "../services";
import { Book } from "@/services/deliveryApi";

interface BookEditModalProps {
  book: Book;
  onComplete: () => void;
  onClose: () => void;
}

interface BookFormData {
  title: string;
  label: string;
  author: string;
  bookType: string;
  series: string;
  volume: string;
  tagline: string;
  description: string;
  notesToReaders: string;
  narrator?: string;
  audioQuality?: string;
}

const BOOK_TYPES = [
  { value: "advance_copy", label: "Advance Copy" },
  { value: "excerpt", label: "Excerpt" },
  { value: "full_book", label: "Full Book" },
  { value: "novella", label: "Novella" },
  { value: "preview", label: "Preview" },
  { value: "sample", label: "Sample" },
  { value: "short_story", label: "Short Story" },
  { value: "teaser", label: "Teaser" },
  { value: "other", label: "Other" },
];

const AUDIO_QUALITIES = [
  { value: "standard", label: "Standard (128 kbps)" },
  { value: "high", label: "High (256 kbps)" },
  { value: "premium", label: "Premium (320 kbps)" },
  { value: "lossless", label: "Lossless (FLAC)" },
];

const BookEditModal: React.FC<BookEditModalProps> = ({
  book,
  onComplete,
  onClose,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form data with book data
  const [bookData, setBookData] = useState<BookFormData>({
    title: book.title || "",
    label: book.label || "",
    author: book.author || "",
    bookType: book.bookType || "full_book",
    series: book.series || "",
    volume: book.volume || "",
    tagline: book.tagline || "",
    description: book.description || "",
    notesToReaders: book.notesToReaders || "",
    narrator: book.narrator || "",
    audioQuality: book.audioQuality || "standard",
  });

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBook = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/books/${book._id}`, {
        ...bookData,
        language: "en",
        ebookType: book.ebookType,
        category: book.ebookType === "audio" ? "audio" : "book",
      });

      onComplete();
      onClose();
    } catch (error) {
      console.error("Update book error:", error);
      alert(
        `Error updating book: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const isAudioBook = book.ebookType === "audio";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Edit {isAudioBook ? "Audio Book" : "Book"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAudioBook ? "Audio Title" : "Book Title"}
                </label>
                <input
                  type="text"
                  value={bookData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={`Enter ${isAudioBook ? "audio" : "book"} title`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={bookData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!isAudioBook && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Label/Subtitle
                    </label>
                    <input
                      type="text"
                      value={bookData.label}
                      onChange={(e) =>
                        handleInputChange("label", e.target.value)
                      }
                      placeholder="Enter book label or subtitle"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Type
                    </label>
                    <select
                      value={bookData.bookType}
                      onChange={(e) =>
                        handleInputChange("bookType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {BOOK_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Series Name
                    </label>
                    <input
                      type="text"
                      value={bookData.series}
                      onChange={(e) =>
                        handleInputChange("series", e.target.value)
                      }
                      placeholder="Enter series name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume Number
                    </label>
                    <input
                      type="text"
                      value={bookData.volume}
                      onChange={(e) =>
                        handleInputChange("volume", e.target.value)
                      }
                      placeholder="e.g., Book 1, Volume 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Tagline
                    </label>
                    <input
                      type="text"
                      value={bookData.tagline}
                      onChange={(e) =>
                        handleInputChange("tagline", e.target.value)
                      }
                      placeholder="Enter catchy tagline"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {isAudioBook && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Narrator
                    </label>
                    <input
                      type="text"
                      value={bookData.narrator || ""}
                      onChange={(e) =>
                        handleInputChange("narrator", e.target.value)
                      }
                      placeholder="Enter narrator name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Audio Quality
                    </label>
                    <select
                      value={bookData.audioQuality || "standard"}
                      onChange={(e) =>
                        handleInputChange("audioQuality", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {AUDIO_QUALITIES.map((quality) => (
                        <option key={quality.value} value={quality.value}>
                          {quality.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <JoditEditor
                  value={bookData.description}
                  onBlur={(newContent) =>
                    handleInputChange("description", newContent)
                  }
                />
              </div>

              {!isAudioBook && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes to Readers
                  </label>
                  <JoditEditor
                    value={bookData.notesToReaders}
                    onBlur={(newContent) =>
                      handleInputChange("notesToReaders", newContent)
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateBook}
                disabled={isUpdating || !bookData.title || !bookData.author}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isUpdating ? "Updating..." : "Update Book"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEditModal;
