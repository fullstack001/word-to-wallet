"use client";
import { useState, useEffect } from "react";
import {
  Course,
  Subject,
  MediaFile,
  MultimediaContent,
} from "@/utils/apiUtils";
import {
  BasicInfoForm,
  FilesMediaForm,
  ChaptersForm,
  MultimediaForm,
  Chapter,
} from "./course";

interface CourseModalProps {
  course?: Course | null;
  selectedSubject?: Subject | null;
  onSubmit: (data: {
    title: string;
    description: string;
    subject: string;
    epubCover?: File | null;
    chapters: Chapter[];
    multimediaContent?: {
      audio: MediaFile[];
      video: MediaFile[];
    };
    isActive?: boolean;
    isPublished?: boolean;
    removeExistingCover?: boolean;
    googleDocLink?: string;
    googleClassroomLink?: string;
  }) => void;
  onClose: () => void;
  error?: string;
  loading?: boolean;
}

export default function CourseModal({
  course,
  selectedSubject,
  onSubmit,
  onClose,
  error,
  loading = false,
}: CourseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    isActive: true,
    isPublished: false,
    googleDocLink: "",
    googleClassroomLink: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [epubCoverFile, setEpubCoverFile] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(
    null
  );
  const [removeExistingCover, setRemoveExistingCover] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "1",
      title: "",
      description: "",
      content: "",
    },
  ]);
  const [multimediaContent, setMultimediaContent] = useState<{
    audio: MediaFile[];
    video: MediaFile[];
  }>({
    audio: [],
    video: [],
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        subject:
          typeof course.subject === "string"
            ? course.subject
            : course.subject._id,
        isActive: course.isActive,
        isPublished: course.isPublished,
        googleDocLink: course.googleDocLink || "",
        googleClassroomLink: course.googleClassroomLink || "",
      });

      // Set existing multimedia content (only audio and video)
      if (course.multimediaContent) {
        setMultimediaContent({
          audio: course.multimediaContent.audio || [],
          video: course.multimediaContent.video || [],
        });
      }

      // Set existing chapters if available (assuming chapters might be in course data)
      if ((course as any).chapters && Array.isArray((course as any).chapters)) {
        setChapters((course as any).chapters);
      }

      // Set existing cover image if available
      if (course.epubCover) {
        // Construct the full URL for the cover image
        const coverUrl = `/api/courses/${course._id}/cover`;
        setExistingCoverImage(coverUrl);
      }
    } else if (selectedSubject) {
      // For new courses, automatically set the subject from the selected subject
      setFormData((prev) => ({
        ...prev,
        subject: selectedSubject._id,
      }));
    }
  }, [course, selectedSubject]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
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
        ...formData,
        epubCover: epubCoverFile,
        chapters: filteredChapters,
        multimediaContent,
        removeExistingCover,
        googleDocLink: formData.googleDocLink,
        googleClassroomLink: formData.googleClassroomLink,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRemoveExistingCover = () => {
    setExistingCoverImage(null);
    setRemoveExistingCover(true);
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: "",
      description: "",
      content: "",
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    }
  };

  const updateChapter = (
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {course ? "Edit Course" : "Create New Course"}
            </h3>
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

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <BasicInfoForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />

              {/* Right Column - Files and Media */}
              <FilesMediaForm
                epubCoverFile={epubCoverFile}
                onEpubCoverChange={setEpubCoverFile}
                existingCoverImage={existingCoverImage}
                onRemoveExistingCover={handleRemoveExistingCover}
              />
            </div>

            {/* Chapters Section - Full Width */}
            <ChaptersForm
              chapters={chapters}
              errors={errors}
              onAddChapter={addChapter}
              onRemoveChapter={removeChapter}
              onUpdateChapter={updateChapter}
            />

            {/* Multimedia Content - Full Width */}
            <MultimediaForm
              multimediaContent={multimediaContent}
              onAudioChange={(files) =>
                setMultimediaContent((prev) => ({ ...prev, audio: files }))
              }
              onVideoChange={(files) =>
                setMultimediaContent((prev) => ({ ...prev, video: files }))
              }
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {course ? "Updating..." : "Creating..."}
                  </div>
                ) : course ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
