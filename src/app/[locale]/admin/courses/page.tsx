"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import AdminHeader from "../../../../components/admin/AdminHeader";
import CourseModal from "../../../../components/admin/CourseModal";
import {
  Course,
  Subject,
  getCourses,
  getSubjects,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublishedStatus,
} from "@/utils/apiUtils";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!user.isAdmin) {
      navigate("/");
      return;
    }

    fetchData();
  }, [isLoggedIn, user.isAdmin]); // Removed navigate from dependencies to prevent re-renders

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      // Fetch courses first (primary data)
      const coursesData = await getCourses();
      setCourses(coursesData);

      // Fetch subjects separately (for dropdowns) - only if courses loaded successfully
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
      } catch (subjectsError: any) {
        console.warn("Failed to fetch subjects:", subjectsError.message);
        // Don't fail the entire page if subjects fail to load
        setSubjects([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch courses:", error.message);
      if (error.message.includes("Too many requests")) {
        if (retryCount < 2) {
          // Retry after a delay
          setTimeout(() => {
            fetchData(retryCount + 1);
          }, 2000 * (retryCount + 1)); // Exponential backoff: 2s, 4s
          setError(`Rate limit exceeded. Retrying... (${retryCount + 1}/2)`);
        } else {
          setError(
            "Rate limit exceeded. Please wait a moment and refresh the page."
          );
        }
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (data: {
    title: string;
    description: string;
    subject: string;
    isActive?: boolean;
    isPublished?: boolean;
  }) => {
    try {
      await createCourse(data);
      await fetchData();
      setShowModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateCourse = async (
    id: string,
    data: {
      title: string;
      description: string;
      subject: string;
      isActive?: boolean;
      isPublished?: boolean;
    }
  ) => {
    try {
      await updateCourse(id, data);
      await fetchData();
      setShowModal(false);
      setEditingCourse(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await deleteCourse(id);
      await fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleTogglePublishedStatus = async (id: string) => {
    try {
      await toggleCoursePublishedStatus(id);
      await fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const getSubjectName = (subjectId: string | Subject) => {
    if (typeof subjectId === "string") {
      const subject = subjects.find((s) => s._id === subjectId);
      return subject ? subject.name : "Unknown Subject";
    } else {
      return subjectId.name;
    }
  };

  // Show loading or redirect if not admin
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

  // Filter courses based on search term, published status, and subject
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPublished =
      filterPublished === null || course.isPublished === filterPublished;
    const matchesSubject =
      filterSubject === "all" || course.subject === filterSubject;
    return matchesSearch && matchesPublished && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        user={user}
        onLogout={handleLogout}
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                  <p className="mt-2 text-gray-600">
                    Manage your courses and learning materials.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                  Add Course
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
                <button
                  onClick={() => setError("")}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading courses...</span>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {courses.length === 0 ? (
                  <div className="text-center py-12">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No courses
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new course.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowModal(true)}
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
                        Add Course
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {courses.map((course) => (
                      <li key={course._id}>
                        <div className="px-4 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    course.isActive
                                      ? "bg-green-400"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">
                                    {course.title}
                                  </p>
                                  <div className="ml-2 flex space-x-1">
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
                                      {course.isPublished
                                        ? "Published"
                                        : "Draft"}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {course.description}
                                </p>
                                <div className="mt-1 flex items-center text-xs text-gray-400">
                                  <span>
                                    Subject: {getSubjectName(course.subject)}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    Created:{" "}
                                    {new Date(
                                      course.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {course.epubFile && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span className="text-green-600">
                                        EPUB Available
                                      </span>
                                    </>
                                  )}
                                  {course.thumbnail && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span className="text-blue-600">
                                        Thumbnail Available
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleTogglePublishedStatus(course._id)
                                }
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                                  course.isPublished
                                    ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                    : "text-green-700 bg-green-100 hover:bg-green-200"
                                }`}
                              >
                                {course.isPublished ? "Unpublish" : "Publish"}
                              </button>
                              <button
                                onClick={() => openEditModal(course)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <CourseModal
          course={editingCourse}
          subjects={subjects}
          onSubmit={
            editingCourse
              ? (data) => handleUpdateCourse(editingCourse._id, data)
              : handleCreateCourse
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
}
