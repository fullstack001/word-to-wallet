"use client";
import JoditEditor from "jodit-react";
import "./jodit-styles.css";

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
}

interface ChaptersFormProps {
  chapters: Chapter[];
  errors: { [key: string]: string };
  onAddChapter: () => void;
  onRemoveChapter: (chapterId: string) => void;
  onUpdateChapter: (
    chapterId: string,
    field: keyof Chapter,
    value: string
  ) => void;
}

export default function ChaptersForm({
  chapters,
  errors,
  onAddChapter,
  onRemoveChapter,
  onUpdateChapter,
}: ChaptersFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
          Course Chapters
        </h4>
        <button
          type="button"
          onClick={onAddChapter}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Chapter
        </button>
      </div>

      {errors.chapters && (
        <p className="text-sm text-red-600">{errors.chapters}</p>
      )}

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-md font-medium text-gray-900">
                Chapter {index + 1}
              </h5>
              {chapters.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveChapter(chapter.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) =>
                    onUpdateChapter(chapter.id, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter chapter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Description
                </label>
                <input
                  type="text"
                  value={chapter.description}
                  onChange={(e) =>
                    onUpdateChapter(chapter.id, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter chapter description"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter Content
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <JoditEditor
                  value={chapter.content}
                  onBlur={(newContent) =>
                    onUpdateChapter(chapter.id, "content", newContent)
                  }
                  onChange={(newContent) =>
                    onUpdateChapter(chapter.id, "content", newContent)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
