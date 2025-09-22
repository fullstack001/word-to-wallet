"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import {
  getCourseById,
  getSubjects,
  updateCourse,
  Course,
  Subject,
} from "@/utils/apiUtils";
import AdminSidebar from "../../../../../../components/admin/AdminSidebar";
import AdminHeader from "../../../../../../components/admin/AdminHeader";
import CourseModal from "../../../../../../components/admin/CourseModal";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [course, setCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const courseId = params.id as string;

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
  }, [isLoggedIn, user.isAdmin, courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseData, subjectsData] = await Promise.all([
        getCourseById(courseId),
        getSubjects(),
      ]);

      setCourse(courseData);
      setSubjects(subjectsData);
    } catch (error: any) {
      setError(error.message || "Failed to load course data");
    } finally {
      setLoading(false);
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
    removeExistingCover?: boolean;
  }) => {
    try {
      if (!course) return;

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
        removeExistingCover: data.removeExistingCover,
      };

      await updateCourse(course._id, updateData);

      // Navigate back to courses list
      navigate("/admin/courses");
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

  const handleCancel = () => {
    navigate("/admin/courses");
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

  if (loading) {
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
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading course data...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
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
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
                <button
                  onClick={() => setError("")}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
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
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Course Not Found
                </h1>
                <p className="text-gray-600 mb-4">
                  The course you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => navigate("/admin/courses")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back to Courses
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Edit Course
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Update course information, content, and multimedia files.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
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

            {/* Course Edit Form */}
            <div className="bg-white shadow rounded-lg">
              <CourseModal
                course={course}
                selectedSubject={null}
                onSubmit={handleUpdateCourse}
                onClose={handleCancel}
                error={error}
                loading={false}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
