"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import { PageLoading } from "@/components/common/Loading";
import { canAccessPlatform } from "@/utils/subscriptionUtils";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requireSubscription?: boolean;
}

export default function AuthGuard({
  children,
  redirectTo = "/signup",
  requireAuth = true,
  requireSubscription = false,
}: AuthGuardProps) {
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // Helper function to check if user can access platform
  const canUserAccessPlatform = () => {
    return canAccessPlatform(user);
  };

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      // User needs to be authenticated but isn't
      setIsRedirecting(true);
      navigate(redirectTo);
    } else if (requireAuth && isLoggedIn && requireSubscription) {
      // User is logged in but needs subscription validation
      if (!canUserAccessPlatform()) {
        // User doesn't have access (not admin and no valid subscription)
        setIsRedirecting(true);
        navigate("/signup"); // Redirect to signup to complete payment
        return;
      }
    } else if (!requireAuth && isLoggedIn) {
      // User is authenticated but shouldn't be (e.g., on login/signup pages)
      setIsRedirecting(true);
      // Redirect admin users to admin dashboard, regular users to dashboard
      const redirectPath = user?.isAdmin ? "/admin/dashboard" : "/dashboard";
      navigate(redirectPath);
    }
  }, [
    isLoggedIn,
    navigate,
    redirectTo,
    requireAuth,
    requireSubscription,
    user?.isAdmin,
    user?.subscription,
  ]);

  // Show loading while redirecting
  if (isRedirecting) {
    return <PageLoading message="Redirecting..." />;
  }

  // User authentication state matches requirements
  return <>{children}</>;
}
