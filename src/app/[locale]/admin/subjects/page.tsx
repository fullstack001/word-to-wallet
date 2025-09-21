"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import AdminHeader from "../../../../components/admin/AdminHeader";
import SubjectModal from "../../../../components/admin/SubjectModal";
import {
  Subject,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  toggleSubjectStatus,
} from "@/utils/apiUtils";

export default function SubjectsPage() {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

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

    fetchSubjects();
  }, [isLoggedIn, user.isAdmin]); // Removed navigate from dependencies to prevent re-renders

  const fetchSubjects = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const data = await getSubjects();
      setSubjects(data);
    } catch (error: any) {
      console.error("Failed to fetch subjects:", error.message);
      if (error.message.includes("Too many requests")) {
        if (retryCount < 2) {
          // Retry after a delay
          setTimeout(() => {
            fetchSubjects(retryCount + 1);
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

  const handleCreateSubject = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      setModalLoading(true);
      setModalError(""); // Clear previous errors
      await createSubject(data);
      await fetchSubjects();
      setShowModal(false);
      setModalError(""); // Clear error on success
    } catch (error: any) {
      console.error("Failed to create subject:", error.message);
      setModalError(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateSubject = async (
    id: string,
    data: { name: string; description: string }
  ) => {
    try {
      setModalLoading(true);
      setModalError(""); // Clear previous errors
      await updateSubject(id, data);
      await fetchSubjects();
      setShowModal(false);
      setEditingSubject(null);
      setModalError(""); // Clear error on success
    } catch (error: any) {
      console.error("Failed to update subject:", error.message);
      setModalError(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      await deleteSubject(id);
      await fetchSubjects();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleSubjectStatus(id);
      await fetchSubjects();
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

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setModalError(""); // Clear any previous errors
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setModalError(""); // Clear errors when closing modal
  };

  // Filter subjects based on search term and active status
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === null || subject.isActive === filterActive;
    return matchesSearch && matchesFilter;
  });

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
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
                  <p className="mt-2 text-gray-600">
                    Manage your course subjects and categories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalError(""); // Clear any previous errors
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
              </div>

              {/* Search and Filter Bar */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={
                      filterActive === null ? "all" : filterActive.toString()
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterActive(
                        value === "all" ? null : value === "true"
                      );
                    }}
                    className="block px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterActive(null);
                    }}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            {!loading && subjects.length > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredSubjects.length} of {subjects.length} subjects
                {(searchTerm || filterActive !== null) && (
                  <span className="ml-2">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterActive(null);
                      }}
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      Clear filters
                    </button>
                  </span>
                )}
              </div>
            )}

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
                <span className="ml-2 text-gray-600">Loading subjects...</span>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {filteredSubjects.length === 0 ? (
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {subjects.length === 0
                        ? "No subjects"
                        : "No subjects found"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {subjects.length === 0
                        ? "Get started by creating a new subject."
                        : "Try adjusting your search or filter criteria."}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setModalError(""); // Clear any previous errors
                          setShowModal(true);
                        }}
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
                        Add Subject
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredSubjects.map((subject) => (
                      <li key={subject._id}>
                        <div className="px-4 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  subject.isActive
                                    ? "bg-green-400"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {subject.name}
                                </p>
                                <span
                                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    subject.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {subject.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {subject.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Created:{" "}
                                {new Date(
                                  subject.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStatus(subject._id)}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                                subject.isActive
                                  ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                  : "text-green-700 bg-green-100 hover:bg-green-200"
                              }`}
                            >
                              {subject.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => openEditModal(subject)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(subject._id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              Delete
                            </button>
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
        <SubjectModal
          subject={editingSubject}
          onSubmit={
            editingSubject
              ? (data) => handleUpdateSubject(editingSubject._id, data)
              : handleCreateSubject
          }
          onClose={closeModal}
          error={modalError}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
