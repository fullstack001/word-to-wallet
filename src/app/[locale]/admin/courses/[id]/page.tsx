"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { deleteCourse, toggleCoursePublishedStatus } from "@/utils/apiUtils";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import CourseView from "@/components/CourseView";
import { BackButton } from "@/components/common";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

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
  }, [isLoggedIn, user.isAdmin, navigate]);

  const handleEdit = () => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteCourse(courseId);
      navigate("/admin/courses");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleTogglePublished = async () => {
    try {
      await toggleCoursePublishedStatus(courseId);
      // The CourseView component will refetch the course data
    } catch (error: any) {
      setError(error.message);
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
          {/* Enhanced Back Button */}
          <div className="mb-6">
            <BackButton onClick={() => navigate("/admin/courses")}>
              Back to Courses
            </BackButton>
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

          <CourseView
            courseId={courseId}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
          />
        </main>
      </div>
    </div>
  );
}
