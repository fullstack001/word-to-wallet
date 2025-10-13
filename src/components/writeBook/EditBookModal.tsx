"use client";

import React, { useState } from "react";
import { WrittenBook, updateBook } from "../../utils/apiUtils";
import ChaptersForm, { Chapter } from "../admin/course/ChaptersForm";

interface EditBookModalProps {
  book: WrittenBook;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookModal({
  book,
  onClose,
  onSuccess,
}: EditBookModalProps) {
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description || "");
  const [chapters, setChapters] = useState<Chapter[]>(book.chapters);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(book.format);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const filteredChapters = chapters.filter(
        (chapter) =>
          chapter.title.trim() &&
          chapter.description.trim() &&
          chapter.content.trim()
      );

      await updateBook(book._id, {
        title: title.trim(),
        description: description.trim() || undefined,
        chapters: filteredChapters,
        format: selectedFormats,
      });

      onSuccess();
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setLoading(false);
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
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== format));
      }
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Note:</p>
                <p>
                  Updating the title or chapters will regenerate the book files.
                  This may take a few moments.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
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
                  Updating...
                </span>
              ) : (
                "Update Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
