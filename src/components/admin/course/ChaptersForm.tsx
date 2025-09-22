"use client";
import { useState } from "react";
import JoditEditor from "jodit-react";
import {
  generateChapterContent,
  GenerateContentRequest,
} from "@/utils/apiUtils";
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
  const [generatingContent, setGeneratingContent] = useState<string | null>(
    null
  );
  const [generationErrors, setGenerationErrors] = useState<{
    [chapterId: string]: string;
  }>({});

  const handleGenerateContent = async (
    chapterId: string,
    title: string,
    description: string
  ) => {
    // Clear any previous errors for this chapter
    setGenerationErrors((prev) => ({ ...prev, [chapterId]: "" }));

    // Frontend validation
    if (!title.trim()) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter title is required to generate content.",
      }));
      return;
    }

    if (!description.trim()) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter description is required to generate content.",
      }));
      return;
    }

    if (title.trim().length < 3) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter title must be at least 3 characters long.",
      }));
      return;
    }

    if (description.trim().length < 10) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter description must be at least 10 characters long.",
      }));
      return;
    }

    if (title.trim().length > 200) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter title must be less than 200 characters.",
      }));
      return;
    }

    if (description.trim().length > 1000) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter description must be less than 1000 characters.",
      }));
      return;
    }

    setGeneratingContent(chapterId);

    try {
      const requestData: GenerateContentRequest = {
        title: title.trim(),
        description: description.trim(),
        // Not passing courseTitle and subjectName - let AI focus on chapter content
      };

      const response = await generateChapterContent(requestData);

      if (response.success && response.data.content) {
        onUpdateChapter(chapterId, "content", response.data.content);
        setGenerationErrors((prev) => ({ ...prev, [chapterId]: "" })); // Clear errors on success
      } else {
        setGenerationErrors((prev) => ({
          ...prev,
          [chapterId]: "Failed to generate content. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]:
          error instanceof Error
            ? error.message
            : "Failed to generate content. Please try again.",
      }));
    } finally {
      setGeneratingContent(null);
    }
  };
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Content
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleGenerateContent(
                      chapter.id,
                      chapter.title,
                      chapter.description
                    )
                  }
                  disabled={generatingContent === chapter.id}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    generatingContent === chapter.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {generatingContent === chapter.id ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate with AI
                    </>
                  )}
                </button>
              </div>

              {generationErrors[chapter.id] && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">
                    {generationErrors[chapter.id]}
                  </p>
                </div>
              )}

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
