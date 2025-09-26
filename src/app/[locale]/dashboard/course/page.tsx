"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HomeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { RootState } from "@/store/store";
import { PageLoading } from "@/components/common/Loading";
import {
  getCourseCoverUrl,
  hasCourseCover,
  handleImageError,
} from "@/utils/imageUtils";
import {
  fetchSubjects,
  fetchAllCourses,
  fetchCoursesBySubject,
  Subject,
  Course,
} from "@/utils/courseApi";

export default function CoursePage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subjectsFetched = useRef(false);
  const coursesFetched = useRef(false);

  const fetchSubjectsData = useCallback(async () => {
    if (subjectsFetched.current) return;

    try {
      setError(null);
      const subjectsData = await fetchSubjects();
      setSubjects(subjectsData);
      subjectsFetched.current = true;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError(
        "Failed to load subjects. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllCoursesData = useCallback(async () => {
    if (coursesFetched.current && !selectedSubject) return;

    setIsLoadingCourses(true);
    try {
      const coursesData = await fetchAllCourses();
      setCourses(coursesData);
      coursesFetched.current = true;
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  }, [selectedSubject]);

  const fetchCoursesBySubjectData = useCallback(async (subjectId: string) => {
    setIsLoadingCourses(true);
    try {
      const coursesData = await fetchCoursesBySubject(subjectId);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses by subject:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchSubjectsData();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (selectedSubject) {
      fetchCoursesBySubjectData(selectedSubject);
    } else {
      fetchAllCoursesData();
    }
  }, [selectedSubject]);

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSearchQuery("");
    coursesFetched.current = false; // Reset courses fetch flag
  };

  const handleClearFilter = () => {
    setSelectedSubject(null);
    setSearchQuery("");
    coursesFetched.current = false; // Reset courses fetch flag
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <PageLoading message="Loading courses..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Courses
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchSubjectsData();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
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
          {/* Breadcrumb Navigation */}
          <div className="py-4 border-b border-gray-100">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">All Courses</span>
            </nav>
          </div>

          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <ArrowRightIcon className="w-5 h-5 rotate-180" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Browse Courses
                </h1>
                <p className="text-gray-600">
                  Explore all available courses by subject
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Subjects Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subjects
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {subjects.length} subjects available
                </p>
              </div>

              <div className="p-4">
                {/* All Courses Button */}
                <button
                  onClick={handleClearFilter}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 mb-2 ${
                    !selectedSubject
                      ? "bg-purple-50 border-2 border-purple-200"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">All Courses</p>
                      <p className="text-sm text-gray-600">
                        {courses.length} courses
                      </p>
                    </div>
                  </div>
                </button>

                {/* Subject List */}
                <div className="space-y-2">
                  {subjects.map((subject, index) => (
                    <motion.button
                      key={subject._id}
                      onClick={() => handleSubjectClick(subject._id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedSubject === subject._id
                          ? "bg-purple-50 border-2 border-purple-200"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                          <AcademicCapIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {subject.name}
                          </p>
                          {subject.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {subject.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Courses Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedSubject
                        ? subjects.find((s) => s._id === selectedSubject)
                            ?.name + " Courses"
                        : "All Courses"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredCourses.length} of {courses.length} courses
                      {selectedSubject && " in this subject"}
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses Grid */}
              <div className="p-6">
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading courses...</p>
                    </div>
                  </div>
                ) : filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                      <motion.div
                        key={course._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        onClick={() => handleCourseClick(course._id)}
                      >
                        {/* Course Cover */}
                        <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative overflow-hidden">
                          {hasCourseCover(course) ? (
                            <img
                              src={getCourseCoverUrl(course._id)}
                              alt={course.title}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpenIcon className="w-16 h-16 text-white/80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-sm font-medium text-gray-900">
                                {course.subject?.name || "Unknown Subject"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                            {course.title || "Untitled Course"}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {course.description || "No description available"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>
                                by {course.createdBy?.firstName || "James"}{" "}
                                {course.createdBy?.lastName || "Musgrave"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ArrowRightIcon className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery
                        ? "No courses found"
                        : selectedSubject
                        ? "No courses in this subject"
                        : "No courses available"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : selectedSubject
                        ? "This subject doesn't have any published courses yet"
                        : "There are currently no published courses available"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
