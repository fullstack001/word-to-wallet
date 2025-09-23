"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  getCourseCoverUrl,
  hasCourseCover,
  handleImageError,
} from "../../../utils/imageUtils";

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

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
}

export default function CourseCard({ course, onCourseClick }: CourseCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getProgressText = (progress: number) => {
    if (progress >= 100) return "Completed";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {hasCourseCover(course) ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img
                  src={getCourseCoverUrl(course._id)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600">
                {course.subject?.name || "General"}
              </p>
              <p className="text-xs text-gray-500">
                by {course.createdBy?.firstName} {course.createdBy?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={() => onCourseClick(course._id)}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm text-gray-600">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                  course.progress
                )}`}
                style={{ width: `${Math.min(course.progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getProgressText(course.progress)}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <PlayIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
            {course.chapters && course.chapters.length > 0 && (
              <div className="flex items-center space-x-1">
                <BookOpenIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {course.chapters.length} chapters
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onCourseClick(course._id)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            {course.progress === 100 ? "Review" : "Start Learning"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
