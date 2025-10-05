"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getSubjects, getCourses } from "@/utils/apiUtils";

interface DashboardStats {
  totalSubjects: number;
  totalCourses: number;
  publishedCourses: number;
  activeSubjects: number;
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  // Initialize auth state on client side
  const { isInitializing } = useAuthInitialization();

  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalCourses: 0,
    publishedCourses: 0,
    activeSubjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    console.log(
      "Admin dashboard useEffect - isLoggedIn:",
      isLoggedIn,
      "user.isAdmin:",
      user.isAdmin,
      "isInitializing:",
      isInitializing
    );

    // Wait for auth initialization to complete
    if (isInitializing) {
      console.log("Auth initialization in progress, waiting...");
      return;
    }

    // Check if user is logged in and is admin
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to login");
      navigate("/login");
      return;
    }
    if (!user.isAdmin) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
      return;
    }

    console.log(
      "Auth initialization complete, attempting to fetch dashboard stats"
    );
    // Only fetch if data is older than 30 seconds to avoid rate limiting
    const now = Date.now();
    if (now - lastFetchTime > 30000) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user.isAdmin, isInitializing, navigate, lastFetchTime]);

  const fetchDashboardStats = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching dashboard stats - User:", user);
      console.log(
        "Auth token available:",
        !!localStorage.getItem("authToken") ||
          !!sessionStorage.getItem("authToken")
      );

      // Add delay between requests to avoid rate limiting
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }

      const [subjects, courses] = await Promise.all([
        getSubjects(),
        getCourses(),
      ]);

      const publishedCourses = courses.filter(
        (course) => course.isPublished
      ).length;
      const activeSubjects = subjects.filter(
        (subject) => subject.isActive
      ).length;

      setStats({
        totalSubjects: subjects.length,
        totalCourses: courses.length,
        publishedCourses,
        activeSubjects,
      });

      // Update last fetch time
      setLastFetchTime(Date.now());
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);

      if (error.message.includes("Too many requests") && retryCount < 2) {
        // Retry with exponential backoff
        setTimeout(() => {
          fetchDashboardStats(retryCount + 1);
        }, 2000 * (retryCount + 1));
        setError(`Rate limit exceeded. Retrying... (${retryCount + 1}/2)`);
      } else {
        if (lastFetchTime > 0) {
          setError(
            "Failed to refresh data. Showing cached information. Please try again later."
          );
        } else {
          setError(
            "Failed to load dashboard statistics. Please try again later."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading or redirect if not admin
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        user={user}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex">
        <AdminSidebar
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Welcome back, {user.name || user.email}! Manage your
                    subjects and courses.
                  </p>
                </div>
                <button
                  onClick={() => fetchDashboardStats()}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loading ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
                    <button
                      onClick={() => fetchDashboardStats()}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Last Updated */}
            {!loading && lastFetchTime > 0 && (
              <div className="mb-4 text-xs text-gray-500">
                Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
              </div>
            )}

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Subjects
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                          ) : (
                            stats.totalSubjects
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Courses
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                          ) : (
                            stats.totalCourses
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Published Courses
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                          ) : (
                            stats.publishedCourses
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Subjects
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                          ) : (
                            stats.activeSubjects
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate("/admin/courses")}
                    className="group inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Subject
                  </button>

                  <button
                    onClick={() => navigate("/admin/courses")}
                    className="group inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Course
                  </button>

                  <button
                    onClick={() => navigate("/admin/courses")}
                    className="group inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Manage Subjects
                  </button>

                  <button
                    onClick={() => navigate("/admin/courses")}
                    className="group inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Manage Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No recent activity
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by creating your first subject or course.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate("/admin/courses")}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Subject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
