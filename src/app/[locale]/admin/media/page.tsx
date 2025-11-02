"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaManagement from "@/components/media/MediaManagement";

export default function AdminMediaPage() {
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
                Media Management
              </h1>
              <p className="mt-2 text-gray-600">
                You may upload your own media to use. Copy the url link and put
                it in your promotion. All images, audio, and video can also be
                inserted from other online sources (YouTube, Vimeo, etc.).
              </p>
            </div>

            <MediaManagement />
          </div>
        </main>
      </div>
    </div>
  );
}
