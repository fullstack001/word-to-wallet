"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import JoditEditor from "jodit-react";
import { useLocalizedNavigation } from "@/utils/navigation";
import { api } from "../services";

interface BookCreationWizardProps {
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

const BookCreationWizard: React.FC<BookCreationWizardProps> = ({
  onComplete,
  onClose,
}) => {
  const { navigate } = useLocalizedNavigation();
  const [creationType, setCreationType] = useState<"book" | "audio" | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // Form data state
  const [bookData, setBookData] = useState<BookFormData>({
    title: "",
    label: "",
    author: "",
    bookType: "full_book",
    series: "",
    volume: "",
    tagline: "",
    description: "",
    notesToReaders: "",
    narrator: "",
    audioQuality: "standard",
  });

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  const createDraft = async () => {
    setIsCreating(true);
    try {
      const result = await api.post("/books/draft", {
        ...bookData,
        language: "en",
        ebookType: creationType === "audio" ? "audio" : "doc",
        category: creationType === "audio" ? "audio" : "book",
      });

      // Redirect to the manage book page
      navigate(`/delivery/book/${result.data._id}`);
      onComplete();
    } catch (error) {
      console.error("Create draft error:", error);
      alert(
        `Error creating draft: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Book
        </h2>
        <p className="text-gray-600">
          Choose the type of content you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setCreationType("book")}
          className={`p-6 border-2 rounded-lg text-center transition-colors ${
            creationType === "book"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-xl">📖</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Add New Book</h3>
          <p className="text-gray-600">
            Create an eBook with EPUB or PDF format
          </p>
        </button>

        <button
          onClick={() => setCreationType("audio")}
          className={`p-6 border-2 rounded-lg text-center transition-colors ${
            creationType === "audio"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-xl">🎵</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Add New Short Audio</h3>
          <p className="text-gray-600">
            Create an audio book with MP3, M4A, WAV, or AAC format
          </p>
        </button>
      </div>

      {creationType && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {creationType === "book" ? "Book Information" : "Audio Information"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {creationType === "book" ? "Book Title" : "Audio Title"}
              </label>
              <input
                type="text"
                value={bookData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder={`Enter ${creationType} title`}
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

            {creationType === "book" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Label/Subtitle
                  </label>
                  <input
                    type="text"
                    value={bookData.label}
                    onChange={(e) => handleInputChange("label", e.target.value)}
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

            {creationType === "audio" && (
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

            {creationType === "book" && (
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

          <div className="flex justify-end mt-6">
            <button
              onClick={createDraft}
              disabled={isCreating || !bookData.title || !bookData.author}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isCreating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isCreating ? "Creating..." : "Create & Manage"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {creationType === "book"
                ? "Create New Book"
                : "Create New Audio Book"}
            </h1>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Book Creation Form */}
          {renderStep1()}
        </div>
      </div>
    </div>
  );
};

export default BookCreationWizard;
