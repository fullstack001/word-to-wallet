"use client";

import React, { useState } from "react";
import ChaptersForm, { Chapter } from "../admin/course/ChaptersForm";

interface WriteBookFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    chapters: Chapter[];
    format: string[];
  }) => void;
  loading?: boolean;
  error?: string | null;
}

export default function WriteBookForm({
  onSubmit,
  loading = false,
  error,
}: WriteBookFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "", description: "", content: "" },
  ]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["epub"]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (
      description &&
      description.trim().length > 0 &&
      description.trim().length < 10
    ) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Validate chapters
    const validChapters = chapters.filter(
      (chapter) =>
        chapter.title.trim() &&
        chapter.description.trim() &&
        chapter.content.trim()
    );

    if (validChapters.length === 0) {
      newErrors.chapters = "At least one complete chapter is required";
    }

    if (selectedFormats.length === 0) {
      newErrors.format = "Please select at least one format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const filteredChapters = chapters.filter(
        (chapter) =>
          chapter.title.trim() &&
          chapter.description.trim() &&
          chapter.content.trim()
      );

      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        chapters: filteredChapters,
        format: selectedFormats,
      });
    }
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: "",
      description: "",
      content: "",
    };
    setChapters([...chapters, newChapter]);
  };

  const handleRemoveChapter = (chapterId: string) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    }
  };

  const handleUpdateChapter = (
    chapterId: string,
    field: keyof Chapter,
    value: string
  ) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
      )
    );
  };

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      // Don't allow deselecting all formats
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== format));
      }
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Book Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Book Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your book title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Book Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Book Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Brief description of your book (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Output Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFormats.includes("epub")}
              onChange={() => toggleFormat("epub")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">EPUB</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFormats.includes("pdf")}
              onChange={() => toggleFormat("pdf")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">PDF</span>
          </label>
        </div>
        {errors.format && (
          <p className="mt-1 text-sm text-red-600">{errors.format}</p>
        )}
      </div>

      {/* Chapters Form */}
      <div>
        <ChaptersForm
          chapterType="Book"
          chapters={chapters}
          errors={errors}
          onAddChapter={handleAddChapter}
          onRemoveChapter={handleRemoveChapter}
          onUpdateChapter={handleUpdateChapter}
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Book...
            </span>
          ) : (
            "Generate Book"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </form>
  );
}
