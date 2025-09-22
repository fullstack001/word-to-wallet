"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../../utils/navigation";
import {
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { RootState } from "../../../../store/store";

interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  duration?: number;
  isCompleted?: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: {
    name: string;
  };
  chapters: Chapter[];
  epubFile?: string;
  isPublished: boolean;
  createdAt: string;
  progress?: number;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchCourse();
  }, [params.id, isLoggedIn, navigate]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`/api/courses/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.data.course);

        // Set first chapter as selected by default
        if (data.data.course.chapters && data.data.course.chapters.length > 0) {
          setSelectedChapter(data.data.course.chapters[0]);
        }

        // Calculate progress
        const completedChapters =
          data.data.course.chapters?.filter((ch: Chapter) => ch.isCompleted)
            .length || 0;
        const totalChapters = data.data.course.chapters?.length || 1;
        setProgress((completedChapters / totalChapters) * 100);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleChapterComplete = async (chapterId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(
        `/api/courses/${params.id}/chapters/${chapterId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state
        if (course) {
          const updatedChapters = course.chapters.map((ch) =>
            ch.id === chapterId ? { ...ch, isCompleted: true } : ch
          );
          setCourse({ ...course, chapters: updatedChapters });

          // Update progress
          const completedChapters = updatedChapters.filter(
            (ch) => ch.isCompleted
          ).length;
          const totalChapters = updatedChapters.length;
          setProgress((completedChapters / totalChapters) * 100);
        }
      }
    } catch (error) {
      console.error("Error completing chapter:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <button
            onClick={handleBackToDashboard}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-gray-600">
                  {typeof course.subject === "object"
                    ? course.subject.name
                    : "General"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-purple-600">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Course Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <p className="text-purple-100">
                      {typeof course.subject === "object"
                        ? course.subject.name
                        : "General"}
                    </p>
                  </div>
                </div>
                <p className="text-purple-100 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Course Progress
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Chapter Content */}
              <div className="p-8">
                {selectedChapter ? (
                  <motion.div
                    key={selectedChapter.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedChapter.title}
                      </h3>
                      {selectedChapter.duration && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <ClockIcon className="w-5 h-5" />
                          <span>{selectedChapter.duration} min</span>
                        </div>
                      )}
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {selectedChapter.description}
                      </p>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="whitespace-pre-wrap text-gray-800">
                          {selectedChapter.content}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          <PlayIcon className="w-5 h-5" />
                          <span>Start Chapter</span>
                        </button>
                      </div>

                      {!selectedChapter.isCompleted && (
                        <button
                          onClick={() =>
                            handleChapterComplete(selectedChapter.id)
                          }
                          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>Mark Complete</span>
                        </button>
                      )}

                      {selectedChapter.isCompleted && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Chapter Selected
                    </h3>
                    <p className="text-gray-600">
                      Select a chapter from the sidebar to start learning.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Chapter List */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Chapters
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {course.chapters?.length || 0} chapters
                </p>
              </div>

              <div className="p-4">
                {course.chapters && course.chapters.length > 0 ? (
                  <div className="space-y-2">
                    {course.chapters.map((chapter, index) => (
                      <motion.button
                        key={chapter.id}
                        onClick={() => handleChapterSelect(chapter)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedChapter?.id === chapter.id
                            ? "bg-purple-50 border-2 border-purple-200"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                chapter.isCompleted
                                  ? "bg-green-100 text-green-600"
                                  : selectedChapter?.id === chapter.id
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {chapter.isCompleted ? (
                                <CheckCircleIcon className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <span
                              className={`font-medium ${
                                selectedChapter?.id === chapter.id
                                  ? "text-purple-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {chapter.title}
                            </span>
                          </div>
                          {chapter.duration && (
                            <span className="text-xs text-gray-500">
                              {chapter.duration}m
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 ml-11 line-clamp-2">
                          {chapter.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No chapters available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Course Info */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Subject
                      </p>
                      <p className="text-sm text-gray-600">
                        {typeof course.subject === "object"
                          ? course.subject.name
                          : "General"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Duration
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.chapters?.reduce(
                          (total, ch) => total + (ch.duration || 0),
                          0
                        ) || 0}{" "}
                        minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Chapters
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.chapters?.length || 0} chapters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
