"use client";

import React, { useState } from "react";
import { WrittenBook } from "../../utils/apiUtils";

interface BookPreviewModalProps {
  book: WrittenBook;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export default function BookPreviewModal({
  book,
  onClose,
  onDownload,
}: BookPreviewModalProps) {
  const [selectedChapter, setSelectedChapter] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {book.title}
              </h2>
              {book.description && (
                <p className="text-gray-600 text-sm">{book.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">By {book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4"
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

          {/* Download Buttons */}
          <div className="flex gap-2 mt-4">
            {book.files.epub && (
              <button
                onClick={() =>
                  onDownload(book.files.epub!.url, `${book.title}.epub`)
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Download EPUB
              </button>
            )}
            {book.files.pdf && (
              <button
                onClick={() =>
                  onDownload(book.files.pdf!.url, `${book.title}.pdf`)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Chapter Navigation */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                CHAPTERS ({book.chapters.length})
              </h3>
              <div className="space-y-1">
                {book.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedChapter === index
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">
                      {index + 1}. {chapter.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {book.chapters[selectedChapter] && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Chapter {selectedChapter + 1}:{" "}
                  {book.chapters[selectedChapter].title}
                </h3>
                {book.chapters[selectedChapter].description && (
                  <p className="text-gray-600 italic mb-4">
                    {book.chapters[selectedChapter].description}
                  </p>
                )}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: book.chapters[selectedChapter].content,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Chapter {selectedChapter + 1} of {book.chapters.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSelectedChapter((prev) => Math.max(0, prev - 1))
                }
                disabled={selectedChapter === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setSelectedChapter((prev) =>
                    Math.min(book.chapters.length - 1, prev + 1)
                  )
                }
                disabled={selectedChapter === book.chapters.length - 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
