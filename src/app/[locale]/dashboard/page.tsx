"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { RootState } from "../../../store/store";
import { logout } from "../../../store/slices/authSlice";
import { clearUser, setUser } from "../../../store/slices/userSlice";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: {
    name: string;
  };
  isPublished: boolean;
  createdAt: string;
  progress?: number;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
}

export default function DashboardPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalTimeSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Only fetch data once
    if (!isDataFetched) {
      fetchDashboardData();
    }
  }, [isLoggedIn, navigate, isDataFetched]);

  const fetchDashboardData = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading || requestInProgress || isDataFetched) return;

    try {
      setIsLoading(true);
      setRequestInProgress(true);
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Single API call to dashboard endpoint
      const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        const {
          stats,
          courses: fetchedCourses,
          subscription,
        } = dashboardData.data;

        setCourses(fetchedCourses);
        setStats(stats);

        // Update user subscription info in Redux if available
        if (subscription && user) {
          dispatch(
            setUser({
              ...user,
              subscription: {
                subscriptionId: subscription.status,
                plan: subscription.plan,
                subscriptionType: subscription.status,
                subscribedDate: subscription.trialStart,
                expiryDate:
                  subscription.trialEnd || subscription.currentPeriodEnd,
                status: subscription.status,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
              },
            })
          );
        }
      } else {
        console.error("Dashboard API failed:", dashboardResponse.status);
        // Set default values if API fails
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalTimeSpent: 0,
        });
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values on error
      setStats({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalTimeSpent: 0,
      });
      setCourses([]);
    } finally {
      setIsLoading(false);
      setRequestInProgress(false);
      setIsDataFetched(true);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const recentCourses = courses.slice(0, 4);
  const inProgressCourses = courses.filter(
    (course) => course.progress && course.progress > 0 && course.progress < 100
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Dashboard Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {user.name || user.email}!
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Your learning dashboard
              </p>

              {/* Subscription Status */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <ClockIcon className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">
                  {user.subscription?.subscriptionType === "trialing"
                    ? `Trial: ${
                        user.subscription?.trialEnd
                          ? Math.ceil(
                              (new Date(user.subscription.trialEnd).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0
                      } days remaining`
                    : user.subscription?.subscriptionType === "active"
                    ? "Active Subscription"
                    : user.subscription?.status === "trialing"
                    ? `Trial: ${
                        user.subscription?.trialEnd
                          ? Math.ceil(
                              (new Date(user.subscription.trialEnd).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0
                      } days remaining`
                    : user.subscription?.status === "active"
                    ? "Active Subscription"
                    : "No Subscription"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.inProgressCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalTimeSpent}h
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/courses")}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-700">
                      Browse Courses
                    </p>
                    <p className="text-sm text-gray-600">
                      Explore all available courses
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 ml-auto" />
                </button>

                <button
                  onClick={() => navigate("/account")}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-green-700">
                      My Account
                    </p>
                    <p className="text-sm text-gray-600">Manage your profile</p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 ml-auto" />
                </button>
              </div>
            </motion.div>

            {/* Recent Courses */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Courses
                </h2>
                <button
                  onClick={() => navigate("/courses")}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View All
                </button>
              </div>

              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => handleCourseClick(course._id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {typeof course.subject === "object"
                            ? course.subject.name
                            : "General"}
                        </p>
                        {course.progress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <PlayIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No courses available yet</p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trial Status */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Trial Status
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="font-semibold text-blue-600">5 days</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: "71%" }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Your trial ends on January 15, 2024
                </p>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Achievements
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      First Course
                    </p>
                    <p className="text-xs text-gray-600">
                      Completed your first course
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Quick Learner
                    </p>
                    <p className="text-xs text-gray-600">
                      Completed 2 courses in a week
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-600">
                    Get help with your account
                  </p>
                </button>
                <button
                  onClick={() => navigate("/faq")}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-sm text-gray-600">
                    Find answers to common questions
                  </p>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
