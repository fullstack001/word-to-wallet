"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminMarketingPage() {
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  // Initialize auth state on client side
  const { isInitializing } = useAuthInitialization();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Wait for auth initialization to complete
    if (isInitializing) {
      return;
    }

    // Check if user is logged in and is admin
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!user.isAdmin) {
      navigate("/");
      return;
    }
  }, [isLoggedIn, user.isAdmin, isInitializing, navigate]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated or not admin (redirect is happening)
  if (!isLoggedIn || !user.isAdmin) {
    return null;
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
              <h1 className="text-3xl font-bold text-gray-900">
                Marketing Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your email marketing campaigns and subscriber lists.
              </p>
            </div>

            {/* MailerLite Link Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  MailerLite
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Email marketing platform for managing campaigns and
                  subscribers
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Access your MailerLite dashboard to create campaigns,
                      manage subscribers, and analyze performance.
                    </p>
                    <a
                      href="https://www.mailerlite.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Open MailerLite
                      <svg
                        className="ml-2 w-4 h-4"
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
                    </a>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guide */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Guide
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Quick tips for using MailerLite effectively
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-blue-600 font-semibold text-sm">
                          1
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Create Segments
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Segment your subscribers based on interests, behavior,
                        or demographics to send targeted campaigns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-blue-600 font-semibold text-sm">
                          2
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Design Campaigns
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Use the drag-and-drop editor to create beautiful email
                        campaigns with images, buttons, and custom content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-blue-600 font-semibold text-sm">
                          3
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Schedule & Send
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Schedule your campaigns for optimal delivery times or
                        send them immediately to your subscribers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-blue-600 font-semibold text-sm">
                          4
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Analyze Results
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Track open rates, click-through rates, and conversions
                        to improve your future campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out MailerLite's comprehensive documentation and support
                resources to get the most out of your email marketing.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.mailerlite.com/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300 transition-colors duration-200"
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Documentation
                </a>
                <a
                  href="https://www.mailerlite.com/academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300 transition-colors duration-200"
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Academy
                </a>
                <a
                  href="https://support.mailerlite.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300 transition-colors duration-200"
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Support
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
