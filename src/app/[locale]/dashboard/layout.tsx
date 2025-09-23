"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard redirectTo="/signup" requireAuth={true}>
      {children}
    </AuthGuard>
  );
}
