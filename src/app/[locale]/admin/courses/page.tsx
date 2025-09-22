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
import Breadcrumb from "../../../../components/admin/Breadcrumb";
import { BackButton } from "../../../../components/common";
import {
  Course,
  Subject,
  getCourses,
  getSubjects,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublishedStatus,
  createSubject,
  deleteSubject,
  CreateSubjectData,
} from "@/utils/apiUtils";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  // New state for subject/course view management
  const [currentView, setCurrentView] = useState<"subjects" | "courses">(
    "subjects"
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Subject management state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    description: "",
  });
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);

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
          console.log(`Rate limit exceeded. Retrying... (${retryCount + 1}/2)`);
        } else {
          console.error(
            "Rate limit exceeded. Please wait a moment and refresh the page."
          );
        }
      } else {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (data: {
    title: string;
    description: string;
    subject: string;
    epubCover?: File | null;
    chapters: any[];
    multimediaContent?: {
      audio: any[];
      video: any[];
    };
    isActive?: boolean;
    isPublished?: boolean;
  }) => {
    try {
      // Convert the data to the new format
      const courseData = {
        title: data.title,
        description: data.description,
        subject: data.subject,
        chapters: data.chapters,
        cover: data.epubCover || undefined,
        audio: data.multimediaContent?.audio?.map((item) => item.file) || [],
        video: data.multimediaContent?.video?.map((item) => item.file) || [],
        isActive: data.isActive,
        isPublished: data.isPublished,
      };

      const newCourse = await createCourse(courseData);
      console.log("Course created:", newCourse);
      console.log("New course subject:", newCourse.subject);
      console.log("Selected subject ID:", selectedSubject?._id);
      console.log("Current view:", currentView);

      // Update local state immediately for better UX
      setCourses((prevCourses) => {
        console.log("Previous courses count:", prevCourses.length);
        const updatedCourses = [...prevCourses, newCourse];
        console.log("Updated courses count:", updatedCourses.length);
        return updatedCourses;
      });

      // Also update filtered courses if we're in courses view and the new course matches the current subject
      if (
        currentView === "courses" &&
        selectedSubject &&
        String(newCourse.subject) === String(selectedSubject._id)
      ) {
        console.log(
          "Updating filtered courses - course matches selected subject"
        );
        setFilteredCourses((prevFilteredCourses) => {
          console.log(
            "Previous filtered courses count:",
            prevFilteredCourses.length
          );
          const updatedFilteredCourses = [...prevFilteredCourses, newCourse];
          console.log(
            "Updated filtered courses count:",
            updatedFilteredCourses.length
          );
          return updatedFilteredCourses;
        });
      } else {
        console.log("Not updating filtered courses - conditions not met");
        console.log("- currentView === 'courses':", currentView === "courses");
        console.log("- selectedSubject exists:", !!selectedSubject);
        console.log(
          "- newCourse.subject === selectedSubject._id:",
          String(newCourse.subject) === String(selectedSubject?._id)
        );
      }

      await fetchData(); // Refresh data to ensure consistency
      setShowModal(false);
    } catch (error: any) {
      console.error("Error creating course:", error.message);
    }
  };

  const handleUpdateCourse = async (data: {
    title: string;
    description: string;
    subject: string;
    epubCover?: File | null;
    chapters: any[];
    multimediaContent?: {
      audio: any[];
      video: any[];
    };
    isActive?: boolean;
    isPublished?: boolean;
  }) => {
    try {
      if (!editingCourse) return;

      // Convert the data to the update format
      const updateData = {
        title: data.title,
        description: data.description,
        subject: data.subject,
        chapters: data.chapters,
        multimediaContent: data.multimediaContent,
        epubCover: data.epubCover,
        audio:
          data.multimediaContent?.audio
            ?.map((item) => item.file)
            .filter(Boolean) || [],
        video:
          data.multimediaContent?.video
            ?.map((item) => item.file)
            .filter(Boolean) || [],
        isActive: data.isActive,
        isPublished: data.isPublished,
      };

      const updatedCourse = await updateCourse(editingCourse._id, updateData);
      console.log("Course updated:", updatedCourse);

      // Update local state immediately for better UX
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === editingCourse._id ? updatedCourse : course
        )
      );

      // Also update filtered courses if we're in courses view
      if (currentView === "courses" && filteredCourses.length > 0) {
        setFilteredCourses((prevFilteredCourses) =>
          prevFilteredCourses.map((course) =>
            course._id === editingCourse._id ? updatedCourse : course
          )
        );
      }

      await fetchData(); // Refresh data to ensure consistency
      setShowModal(false);
      setEditingCourse(null);
    } catch (error: any) {
      console.error("Error updating course:", error.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await deleteCourse(id);
      console.log("Course deleted:", id);

      // Update local state immediately for better UX
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );

      // Also update filtered courses if we're in courses view
      if (currentView === "courses" && filteredCourses.length > 0) {
        setFilteredCourses((prevFilteredCourses) =>
          prevFilteredCourses.filter((course) => course._id !== id)
        );
      }

      await fetchData(); // Refresh data to ensure consistency
    } catch (error: any) {
      console.error("Error deleting course:", error.message);
    }
  };

  const handleTogglePublishedStatus = async (id: string) => {
    try {
      console.log("Toggling published status for course:", id);
      setTogglingCourseId(id); // Set loading state

      const updatedCourse = await toggleCoursePublishedStatus(id);
      console.log("Course status updated:", updatedCourse);
      console.log("Updated course isPublished:", updatedCourse.isPublished);

      // Update local state immediately for better UX
      setCourses((prevCourses) => {
        console.log(
          "Previous courses state:",
          prevCourses.map((c) => ({ id: c._id, isPublished: c.isPublished }))
        );
        const updatedCourses = prevCourses.map((course) =>
          course._id === id
            ? { ...course, isPublished: updatedCourse.isPublished }
            : course
        );
        console.log(
          "Updated courses state:",
          updatedCourses.map((c) => ({ id: c._id, isPublished: c.isPublished }))
        );
        return updatedCourses;
      });

      // Also update filtered courses if we're in courses view
      if (currentView === "courses" && filteredCourses.length > 0) {
        setFilteredCourses((prevFilteredCourses) =>
          prevFilteredCourses.map((course) =>
            course._id === id
              ? { ...course, isPublished: updatedCourse.isPublished }
              : course
          )
        );
      }

      console.log(
        `Course ${
          updatedCourse.isPublished ? "published" : "unpublished"
        } successfully`
      );
    } catch (error: any) {
      console.error("Error toggling course status:", error);
    } finally {
      setTogglingCourseId(null); // Clear loading state
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    // Clear both localStorage and sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  const openEditModal = (course: Course) => {
    navigate(`/admin/courses/${course._id}/edit`);
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

  // New functions for subject/course view management
  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView("courses");
    // Filter courses for this subject
    const subjectCourses = courses.filter((course) => {
      const courseSubjectId =
        typeof course.subject === "string"
          ? course.subject
          : course.subject._id;
      return courseSubjectId === subject._id;
    });
    setFilteredCourses(subjectCourses);
  };

  const handleBackToSubjects = () => {
    setCurrentView("subjects");
    setSelectedSubject(null);
    setFilteredCourses([]);
  };

  const getCoursesForSubject = (subjectId: string) => {
    return courses.filter((course) => {
      const courseSubjectId =
        typeof course.subject === "string"
          ? course.subject
          : course.subject._id;
      return courseSubjectId === subjectId;
    });
  };

  // Subject management functions
  const handleCreateSubject = async () => {
    try {
      if (!subjectFormData.name.trim()) {
        console.error("Subject name is required");
        return;
      }

      const subjectData: CreateSubjectData = {
        name: subjectFormData.name.trim(),
        description: subjectFormData.description.trim(),
      };

      await createSubject(subjectData);
      await fetchData(); // Refresh subjects and courses
      setShowSubjectModal(false);
      setSubjectFormData({ name: "", description: "" });
    } catch (error: any) {
      console.error("Error creating subject:", error.message);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete this subject? This will also delete all courses in this subject."
        )
      ) {
        await deleteSubject(subjectId);
        await fetchData(); // Refresh subjects and courses
      }
    } catch (error: any) {
      console.error("Error deleting subject:", error.message);
    }
  };

  const openSubjectModal = () => {
    setSubjectFormData({ name: "", description: "" });
    setShowSubjectModal(true);
  };

  const closeSubjectModal = () => {
    setShowSubjectModal(false);
    setSubjectFormData({ name: "", description: "" });
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

  // Filter courses based on current view and filters
  const getDisplayCourses = () => {
    console.log("getDisplayCourses called - currentView:", currentView);
    console.log(
      "getDisplayCourses called - selectedSubject:",
      selectedSubject?._id
    );
    console.log("getDisplayCourses called - courses count:", courses.length);
    console.log(
      "getDisplayCourses called - filteredCourses count:",
      filteredCourses.length
    );

    if (currentView === "subjects") {
      console.log("In subjects view - returning empty array");
      return []; // No courses shown in subjects view
    }

    // In courses view, use filtered courses or apply additional filters
    let coursesToShow =
      currentView === "courses" && selectedSubject ? filteredCourses : courses;

    console.log("coursesToShow count:", coursesToShow.length);

    // Apply search and published filters
    const filtered = coursesToShow.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPublished =
        filterPublished === null || course.isPublished === filterPublished;
      const matchesSubject =
        filterSubject === "all" || course.subject === filterSubject;
      return matchesSearch && matchesPublished && matchesSubject;
    });

    console.log("Final filtered courses count:", filtered.length);
    return filtered;
  };

  const displayCourses = getDisplayCourses();

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

        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            <div className="mb-8">
              {/* Back Button - Separate row for better spacing */}
              {currentView === "courses" && selectedSubject && (
                <div className="mb-4">
                  <BackButton onClick={handleBackToSubjects}>
                    Back to Subjects
                  </BackButton>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Page Title */}
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {currentView === "subjects"
                        ? "Subjects"
                        : selectedSubject
                        ? `${selectedSubject.name} Courses`
                        : "All Courses"}
                    </h1>
                    <p className="mt-2 text-gray-600">
                      {currentView === "subjects"
                        ? "Select a subject to view its courses."
                        : selectedSubject
                        ? `Manage courses for ${selectedSubject.name}.`
                        : "Manage your courses and learning materials."}
                    </p>
                  </div>
                </div>
                {currentView === "subjects" && (
                  <button
                    onClick={openSubjectModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    Add Subject
                  </button>
                )}
                {currentView === "courses" && (
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
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : (
              <div>
                {currentView === "subjects" ? (
                  // Subjects View
                  <div>
                    {subjects.length === 0 ? (
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No subjects
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          No subjects available.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {subjects.map((subject) => {
                          const subjectCourses = getCoursesForSubject(
                            subject._id
                          );
                          const publishedCourses = subjectCourses.filter(
                            (course) => course.isPublished
                          );
                          return (
                            <div
                              key={subject._id}
                              onClick={() => handleSubjectClick(subject)}
                              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer hover:border-blue-300 group"
                            >
                              <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                                    <svg
                                      className="w-6 h-6 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                      {subjectCourses.length}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Courses
                                    </div>
                                  </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                  {subject.name}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4">
                                  {subject.description ||
                                    "No description available"}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                      <span className="text-gray-600">
                                        {publishedCourses.length} Published
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                                      <span className="text-gray-600">
                                        {subjectCourses.length -
                                          publishedCourses.length}{" "}
                                        Draft
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSubject(subject._id);
                                      }}
                                      className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                                      title="Delete Subject"
                                    >
                                      <svg
                                        className="w-3 h-3 text-white"
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
                                    </button>
                                    <svg
                                      className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Courses View
                  <div>
                    {displayCourses.length === 0 ? (
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
                          {selectedSubject
                            ? `No courses in ${selectedSubject.name}`
                            : "No courses"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedSubject
                            ? `No courses available for ${selectedSubject.name}.`
                            : "Get started by creating a new course."}
                        </p>
                        {!selectedSubject && (
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
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayCourses.map((course) => (
                          <div
                            key={course._id}
                            className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                              course.isPublished
                                ? "border-green-500 hover:border-green-400"
                                : "border-yellow-500 hover:border-yellow-400"
                            }`}
                          >
                            {/* Course Image */}
                            <div className="relative h-48 bg-gray-700">
                              {course.epubCover ? (
                                <img
                                  src={`/api/courses/${course._id}/cover`}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg
                                    className="w-16 h-16 text-gray-500"
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
                              )}
                              {/* Status Badge */}
                              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                                {/* Main Status Badge */}
                                <div className="flex items-center space-x-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      course.isPublished
                                        ? "bg-green-400 animate-pulse"
                                        : "bg-yellow-400"
                                    }`}
                                  ></div>
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                                      course.isPublished
                                        ? "bg-green-500 text-white border border-green-400"
                                        : "bg-yellow-500 text-white border border-yellow-400"
                                    }`}
                                  >
                                    {course.isPublished ? (
                                      <>
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Published
                                      </>
                                    ) : (
                                      <>
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Draft
                                      </>
                                    )}
                                  </span>
                                </div>

                                {/* Toggle Button */}
                                <button
                                  onClick={() =>
                                    handleTogglePublishedStatus(course._id)
                                  }
                                  disabled={togglingCourseId === course._id}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                    course.isPublished
                                      ? "bg-red-500 hover:bg-red-600 text-white"
                                      : "bg-green-500 hover:bg-green-600 text-white"
                                  }`}
                                  title={
                                    togglingCourseId === course._id
                                      ? "Updating..."
                                      : course.isPublished
                                      ? "Click to Unpublish"
                                      : "Click to Publish"
                                  }
                                >
                                  {togglingCourseId === course._id ? (
                                    <svg
                                      className="w-4 h-4 animate-spin"
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
                                  ) : course.isPublished ? (
                                    <svg
                                      className="w-4 h-4"
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
                                  ) : (
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Course Content */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white truncate flex-1">
                                  {course.title}
                                </h3>
                                <div className="flex items-center ml-2">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-1 ${
                                      course.isPublished
                                        ? "bg-green-400 animate-pulse"
                                        : "bg-yellow-400"
                                    }`}
                                  ></div>
                                  <span
                                    className={`text-xs font-medium ${
                                      course.isPublished
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                    }`}
                                  >
                                    {course.isPublished ? "LIVE" : "DRAFT"}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-3 truncate">
                                {getSubjectName(course.subject)}
                              </p>
                              <p
                                className="text-xs text-gray-500 mb-4 overflow-hidden"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {course.description}
                              </p>

                              {/* Action Buttons */}
                              <div className="flex justify-center space-x-2">
                                {/* Edit Button - Blue */}
                                <button
                                  onClick={() => openEditModal(course)}
                                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                                  title="Edit Course"
                                >
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>

                                {/* View Button - Green */}
                                <button
                                  onClick={() =>
                                    navigate(`/admin/courses/${course._id}`)
                                  }
                                  className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors duration-200"
                                  title="View Course"
                                >
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
                                </button>

                                {/* Download Button - Gray */}
                                {course.epubFile && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/api/courses/${course._id}/download`,
                                        "_blank"
                                      )
                                    }
                                    className="w-10 h-10 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                                    title="Download EPUB"
                                  >
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
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  </button>
                                )}

                                {/* Delete Button - Red */}
                                <button
                                  onClick={() => handleDeleteCourse(course._id)}
                                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
                                  title="Delete Course"
                                >
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onClose={closeModal}
        />
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Subject
                </h3>
                <button
                  onClick={closeSubjectModal}
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateSubject();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="subjectName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    value={subjectFormData.name}
                    onChange={(e) =>
                      setSubjectFormData({
                        ...subjectFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject name"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="subjectDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="subjectDescription"
                    value={subjectFormData.description}
                    onChange={(e) =>
                      setSubjectFormData({
                        ...subjectFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject description (optional)"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeSubjectModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Create Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
