"use client";
import { useState, useEffect } from "react";
import { Course, getCourseById } from "@/utils/apiUtils";
import EpubReader from "./EpubReader";

interface CourseViewProps {
  courseId: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublished?: () => void;
}

export default function CourseView({
  courseId,
  isAdmin = false,
  onEdit,
  onDelete,
  onTogglePublished,
}: CourseViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading course...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  // Prepare multimedia data for EpubReader
  const prepareMultimediaData = () => {
    const audioItems =
      course?.multimediaContent?.audio?.map((audio, index) => ({
        _id: audio.id || index.toString(),
        title: audio.originalName,
        fileUrl: `/api/courses/${course._id}/multimedia/audio/${audio.filename}`,
      })) || [];

    const videoItems =
      course?.multimediaContent?.video?.map((video, index) => ({
        _id: video.id || index.toString(),
        title: video.originalName,
        fileUrl: `/api/courses/${course._id}/multimedia/video/${video.filename}`,
      })) || [];

    // You can add YouTube items if your course data includes them
    const youtubeItems: any[] = [];

    return { audioItems, videoItems, youtubeItems };
  };

  // Prepare book contents for translation (if available)
  const prepareBookContents = () => {
    // If you have chapter content that can be translated, format it here
    const bookContents =
      course?.chapters?.map((chapter) => ({
        content: chapter.content || "",
      })) || [];

    return bookContents;
  };

  const { audioItems, videoItems, youtubeItems } = prepareMultimediaData();
  const bookContents = prepareBookContents();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <div className="flex space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.isPublished
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>
                  Subject:{" "}
                  {typeof course.subject === "object"
                    ? course.subject.name
                    : "Unknown"}
                </span>
                <span>•</span>
                <span>Created: {formatDate(course.createdAt)}</span>
                {course.updatedAt && (
                  <>
                    <span>•</span>
                    <span>Updated: {formatDate(course.updatedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Cover Image */}
            {course.epubCover && (
              <div className="ml-6">
                <img
                  src={`/api/courses/${course._id}/cover`}
                  alt="Course Cover"
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-6 flex space-x-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Course
                </button>
              )}
              {onTogglePublished && (
                <button
                  onClick={onTogglePublished}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    course.isPublished
                      ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      : "text-green-700 bg-green-100 hover:bg-green-200"
                  }`}
                >
                  {course.isPublished ? "Unpublish" : "Publish"}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Delete Course
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced EPUB Reader */}
      {course.epubFile ? (
        <EpubReader
          epubUrl={`/api/courses/${course._id}/epub`}
          title={course.title}
          author={
            typeof course.subject === "object" ? course.subject.name : "Unknown"
          }
          audioItems={audioItems}
          videoItems={videoItems}
          youtubeItems={youtubeItems}
          bookContents={bookContents}
          bookType="created" // Enable translation features
          onBack={() => window.history.back()}
        />
      ) : (
        <div className="flex items-center justify-center py-12 bg-gray-50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No EPUB file available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This course doesn't have an EPUB file yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
