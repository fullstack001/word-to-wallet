"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import UserList from "@/components/admin/user/UserList";

export default function AdminUsersPage() {
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
            <UserList />
          </div>
        </main>
      </div>
    </div>
  );
}

