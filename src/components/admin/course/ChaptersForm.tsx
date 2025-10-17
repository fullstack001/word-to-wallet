"use client";
import { useState } from "react";
import JoditEditor from "jodit-react";
import {
  generateChapterContent,
  GenerateContentRequest,
  GenerateContentMode,
} from "@/utils/apiUtils";
import AIPromptGenerator from "./AIPromptGenerator";
import "./jodit-styles.css";

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
}

interface ChaptersFormProps {
  chapterType: string;
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

/** Per-chapter UI state for generation controls */
type ChapterGenUI = {
  mode: GenerateContentMode;
  strict: boolean; // only for STRICT_NATIVE_BLOCKS
  instructions: string; // only for STRICT_NATIVE_BLOCKS
  rawHtml: string; // only for RAW_XHTML
};

export default function ChaptersForm({
  chapterType = "Course",
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

  // UI state bucket per chapter (defaults)
  const [genUI, setGenUI] = useState<Record<string, ChapterGenUI>>(() =>
    Object.fromEntries(
      chapters.map((c) => [
        c.id,
        {
          mode: "STRICT_NATIVE_BLOCKS",
          strict: true,
          instructions: "",
          rawHtml: "",
        },
      ])
    )
  );

  // Keep UI state in sync if chapters array changes
  if (chapters.some((c) => !genUI[c.id])) {
    const newState = { ...genUI };
    for (const c of chapters) {
      if (!newState[c.id]) {
        newState[c.id] = {
          mode: "STRICT_NATIVE_BLOCKS",
          strict: true,
          instructions: "",
          rawHtml: "",
        };
      }
    }
    setGenUI(newState);
  }

  const updateGenUI = (chapterId: string, patch: Partial<ChapterGenUI>) => {
    setGenUI((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], ...patch },
    }));
  };

  const validateStrictInputs = (
    chapterId: string,
    title: string,
    description: string
  ) => {
    const ui = genUI[chapterId];

    // Allow either instructions OR (title+description). If both missing, error.
    if (!ui.instructions.trim() && (!title.trim() || !description.trim())) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]:
          "Provide instructions or both title and description to generate content.",
      }));
      return false;
    }

    if (title && title.trim().length > 0 && title.trim().length < 3) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter title must be at least 3 characters long.",
      }));
      return false;
    }
    if (
      description &&
      description.trim().length > 0 &&
      description.trim().length < 10
    ) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter description must be at least 10 characters long.",
      }));
      return false;
    }
    if (title && title.trim().length > 200) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter title must be less than 200 characters.",
      }));
      return false;
    }
    if (description && description.trim().length > 1000) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Chapter description must be less than 1000 characters.",
      }));
      return false;
    }
    return true;
  };

  const validateRawHtml = (chapterId: string) => {
    const ui = genUI[chapterId];
    if (!ui.rawHtml.trim()) {
      setGenerationErrors((prev) => ({
        ...prev,
        [chapterId]: "Paste some HTML to use RAW_XHTML passthrough.",
      }));
      return false;
    }
    return true;
  };

  const handleGenerateContent = async (
    chapterId: string,
    title: string,
    description: string
  ) => {
    setGenerationErrors((prev) => ({ ...prev, [chapterId]: "" }));
    setGeneratingContent(chapterId);

    const ui = genUI[chapterId];

    try {
      let requestData: GenerateContentRequest;

      if (ui.mode === "RAW_XHTML") {
        if (!validateRawHtml(chapterId)) {
          setGeneratingContent(null);
          return;
        }
        requestData = {
          mode: "RAW_XHTML",
          html: ui.rawHtml.trim(),
        };
      } else {
        if (!validateStrictInputs(chapterId, title, description)) {
          setGeneratingContent(null);
          return;
        }
        requestData = {
          mode: "STRICT_NATIVE_BLOCKS",
          strict: ui.strict,
          instructions: ui.instructions?.trim() || undefined,
          title: title?.trim() || undefined,
          description: description?.trim() || undefined,
        };
      }

      const response = await generateChapterContent(requestData);

      if (response.success && response.data) {
        if (response.data.mode === "STRICT_NATIVE_BLOCKS") {
          onUpdateChapter(chapterId, "content", response.data.html);
        } else {
          onUpdateChapter(chapterId, "content", response.data.content);
        }
        setGenerationErrors((prev) => ({ ...prev, [chapterId]: "" }));
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
          {chapterType} Chapters
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
        {chapters.map((chapter, index) => {
          const ui = genUI[chapter.id] ?? {
            mode: "STRICT_NATIVE_BLOCKS" as GenerateContentMode,
            strict: true,
            instructions: "",
            rawHtml: "",
          };

          return (
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

              {/* Mode selector */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode
                  </label>
                  <select
                    value={ui.mode}
                    onChange={(e) =>
                      updateGenUI(chapter.id, {
                        mode: e.target.value as GenerateContentMode,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="STRICT_NATIVE_BLOCKS">
                      Strict Native Blocks
                    </option>
                    <option value="RAW_XHTML">Raw HTML Passthrough</option>
                  </select>
                </div>

                {/* Strict toggle (only for STRICT_NATIVE_BLOCKS) */}
                {ui.mode === "STRICT_NATIVE_BLOCKS" && (
                  <div className="flex items-end">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={ui.strict}
                        onChange={(e) =>
                          updateGenUI(chapter.id, { strict: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Strict mode (no templates)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Title / Description */}
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

              {/* Mode-specific inputs */}
              {ui.mode === "STRICT_NATIVE_BLOCKS" ? (
                <div className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions (e.g., your promo recipe)
                    </label>
                    <textarea
                      value={ui.instructions}
                      onChange={(e) =>
                        updateGenUI(chapter.id, {
                          instructions: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={`Paste your STRICT_NATIVE_BLOCKS prompt here.\nExample: "Build THREE promotions using ONLY native blocks in this order: 1) Heading ... 8) Button (...)"`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Leave empty to let AI use Title/Description as
                      guidance.
                    </p>
                  </div>

                  {/* AI Prompt Generator */}
                  <div className="border-t pt-4">
                    <AIPromptGenerator
                      onPromptGenerated={(prompt) =>
                        updateGenUI(chapter.id, { instructions: prompt })
                      }
                      currentInstructions={ui.instructions}
                      chapterTitle={chapter.title}
                      chapterDescription={chapter.description}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RAW HTML (passthrough)
                  </label>
                  <textarea
                    value={ui.rawHtml}
                    onChange={(e) =>
                      updateGenUI(chapter.id, { rawHtml: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={`Paste verbatim HTML/XHTML. Scripts/styles will be removed; width/height preserved.\nExample:\n<h2>Test Image</h2>\n<img src="https://example.com/a.jpg" alt="test" width="400" height="267" />\n...`}
                  />
                </div>
              )}

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
          );
        })}
      </div>
    </div>
  );
}
