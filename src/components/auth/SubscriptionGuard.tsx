"use client";

import React from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useLocalizedNavigation } from "@/utils/navigation";
import { PageLoading } from "@/components/common/Loading";
import { useEffect, useState } from "react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function SubscriptionGuard({
  children,
  redirectTo = "/signup",
  fallback,
}: SubscriptionGuardProps) {
  const { canAccess, isAdmin } = useSubscription();
  const { navigate } = useLocalizedNavigation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!canAccess && !isAdmin) {
      setIsRedirecting(true);
      navigate(redirectTo);
    }
  }, [canAccess, isAdmin, navigate, redirectTo]);

  if (isRedirecting) {
    return <PageLoading message="Redirecting..." />;
  }

  if (!canAccess && !isAdmin) {
    return fallback || <PageLoading message="Checking subscription..." />;
  }

  return <>{children}</>;
}
