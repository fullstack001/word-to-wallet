"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import CourseCard from "./CourseCard";

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: {
    _id: string;
    name: string;
  };
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  epubCover?: string;
  chapters?: any[];
  progress?: number;
}

interface Subject {
  _id: string;
  name: string;
}

interface CoursesSectionProps {
  courses: Course[];
  allCourses: Course[];
  subjects: Subject[];
  selectedSubject: string | null;
  onCourseClick: (courseId: string) => void;
  onViewAllCourses: () => void;
  onSubjectClick: (subjectId: string) => void;
  onClearFilter: () => void;
}

export default function CoursesSection({
  courses,
  allCourses,
  subjects,
  selectedSubject,
  onCourseClick,
  onViewAllCourses,
  onSubjectClick,
  onClearFilter,
}: CoursesSectionProps) {
  const recentCourses = courses.slice(0, 4);
  const inProgressCourses = courses.filter(
    (course) => course.progress && course.progress > 0 && course.progress < 100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
      {/* Recent Courses */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Available Courses
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {courses.length} of {allCourses.length} courses available to
                start learning
                {selectedSubject && (
                  <span className="text-purple-600 font-medium">
                    {" "}
                    (filtered by subject)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onViewAllCourses}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Subject Filter */}
          {subjects.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Filter by Subject:
                </h3>
                {selectedSubject && (
                  <button
                    onClick={onClearFilter}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject._id}
                    onClick={() => onSubjectClick(subject._id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedSubject === subject._id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6">
          {recentCourses.length > 0 ? (
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onCourseClick={onCourseClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedSubject
                  ? "No courses found for this subject"
                  : "No courses available"}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedSubject
                  ? "Try selecting a different subject or clear the filter to see all courses."
                  : "There are currently no published courses available. Check back later for new content."}
              </p>
              <div className="flex gap-3 justify-center">
                {selectedSubject && (
                  <button
                    onClick={onClearFilter}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={onViewAllCourses}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {selectedSubject ? "View All Courses" : "Refresh"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* In Progress Courses */}
      {/* <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Continue Learning
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Pick up where you left off
          </p>
        </div>
        <div className="p-6">
          {inProgressCourses.length > 0 ? (
            <div className="space-y-4">
              {inProgressCourses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onCourseClick={onCourseClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses in progress
              </h3>
              <p className="text-gray-600 mb-4">
                Start a course to see your progress here.
              </p>
              <button
                onClick={onViewAllCourses}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>
      </motion.div> */}
    </div>
  );
}
