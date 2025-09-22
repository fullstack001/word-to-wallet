"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

interface AdminHeaderProps {
  user: User;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export default function AdminHeader({
  user,
  onMobileMenuToggle,
  mobileMenuOpen = false,
}: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();

  // Debug logging

  // Internal logout handler
  const handleLogout = () => {
    // Clear all global state
    dispatch(logout());
    dispatch(clearUser());

    // Clear both localStorage and sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("authToken");

    // Close user menu and navigate
    setUserMenuOpen(false);
    navigate("/");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen) {
        const target = event.target as Element;
        // Don't close if clicking inside the dropdown menu
        if (!target.closest(".user-dropdown-menu")) {
          setUserMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="bg-white/10 backdrop-blur-sm p-2 rounded-lg text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${
                  mobileMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                <img
                  src="/logo.png"
                  alt="Word2Wallet Logo"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Word2Wallet Admin
                </h1>
                <p className="text-xs text-blue-100">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 hover:bg-white/10 px-3 py-2 transition-all duration-200 backdrop-blur-sm"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 text-left hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-blue-100">Administrator</p>
              </div>
              <svg
                className={`ml-2 h-4 w-4 text-white/80 transition-transform duration-200 ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="user-dropdown-menu origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm ring-1 ring-black/10 focus:outline-none z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  <div className="px-4 py-4 text-sm text-gray-700 border-b border-gray-100/50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
                        <span className="text-sm font-bold text-white">
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">
                          {user.name || "Admin User"}
                        </p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 mt-1">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-3 transition-colors duration-150">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">View Main Site</p>
                      <p className="text-xs text-gray-500">
                        Go to public website
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors duration-150">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-xs text-gray-500">
                        Logout from admin panel
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
