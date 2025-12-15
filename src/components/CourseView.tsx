"use client";
import { useState, useEffect } from "react";
import { Course, getCourseById } from "@/utils/apiUtils";
import EpubReader from "./EpubReader";
import { useLocalizedNavigation } from "@/utils/navigation";
import {
  HomeIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

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
  const { navigate } = useLocalizedNavigation();
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

  const handleBackToCourses = () => {
    // Check if we're in admin context by looking at the current path
    const isAdminContext = window.location.pathname.includes("/admin");
    if (isAdminContext) {
      navigate("/admin/courses");
    } else {
      navigate("/dashboard/course");
    }
  };

  const handleBackToDashboard = () => {
    // Check if we're in admin context by looking at the current path
    const isAdminContext = window.location.pathname.includes("/admin");
    if (isAdminContext) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-center sm:text-left">
            Loading course...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md max-w-md w-full text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Course not found</p>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>
                {window.location.pathname.includes("/admin")
                  ? "Admin Dashboard"
                  : "Dashboard"}
              </span>
            </button>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <button
              onClick={handleBackToCourses}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {window.location.pathname.includes("/admin")
                ? "Admin Courses"
                : "Course"}
            </button>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">
              {course?.title || "Loading..."}
            </span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={handleBackToCourses}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="font-medium">
                    {window.location.pathname.includes("/admin")
                      ? "Back to Admin Courses"
                      : "Back to Courses"}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                  {course.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
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
              <p className="text-base sm:text-lg text-gray-600 mb-4">
                {course.description}
              </p>

              {/* Google Links */}
              {(course.googleDocLink || course.googleClassroomLink) && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    External Resources
                  </h3>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    {course.googleDocLink && (
                      <a
                        href={course.googleDocLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center sm:justify-start px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                        <span className="truncate">Google Doc</span>
                      </a>
                    )}
                    {course.googleClassroomLink && (
                      <a
                        href={course.googleClassroomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center sm:justify-start px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M1 3h22v18H1V3zm2 2v14h18V5H3zm2 2h14v2H5V7zm0 4h14v2H5v-2zm0 4h10v2H5v-2z" />
                        </svg>
                        <span className="truncate">Google Classroom</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span>
                    Subject:{" "}
                    {typeof course.subject === "object"
                      ? course.subject.name
                      : "Unknown"}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>Created: {formatDate(course.createdAt)}</span>
                </div>
                {course.updatedAt && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">•</span>
                    <span>Updated: {formatDate(course.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            {course.epubCover && (
              <div className="flex justify-center lg:justify-end lg:ml-6 flex-shrink-0">
                <img
                  src={`/api/courses/${course._id}/cover`}
                  alt="Course Cover"
                  className="max-w-[200px] sm:max-w-[250px] lg:max-w-[300px] max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] w-auto h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
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
                  <span>Edit Course</span>
                </button>
              )}
              {onTogglePublished && (
                <button
                  onClick={onTogglePublished}
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    course.isPublished
                      ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      : "text-green-700 bg-green-100 hover:bg-green-200"
                  }`}
                >
                  <span>{course.isPublished ? "Unpublish" : "Publish"}</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
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
                  <span>Delete Course</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced EPUB Reader */}
      {course.epubFile ? (
        <div className="w-full">
          <EpubReader
            epubUrl={`/api/courses/${course._id}/epub`}
            title={course.title}
            author={
              typeof course.subject === "object"
                ? course.subject.name
                : "Unknown"
            }
            audioItems={audioItems}
            videoItems={videoItems}
            youtubeItems={youtubeItems}
            bookContents={bookContents}
            bookType="created" // Enable translation features
            onBack={() => window.history.back()}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md">
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
