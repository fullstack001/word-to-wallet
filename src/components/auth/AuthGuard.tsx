"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { PageLoading } from "@/components/common/Loading";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  redirectTo = "/signup",
  requireAuth = true,
}: AuthGuardProps) {
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      // User needs to be authenticated but isn't
      setIsRedirecting(true);
      navigate(redirectTo);
    } else if (!requireAuth && isLoggedIn) {
      // User is authenticated but shouldn't be (e.g., on login/signup pages)
      setIsRedirecting(true);
      // Redirect admin users to admin dashboard, regular users to dashboard
      const redirectPath = user?.isAdmin ? "/admin/dashboard" : "/dashboard";
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate, redirectTo, requireAuth, user?.isAdmin]);

  // Show loading while redirecting
  if (isRedirecting) {
    return <PageLoading message="Redirecting..." />;
  }

  // User authentication state matches requirements
  return <>{children}</>;
}
