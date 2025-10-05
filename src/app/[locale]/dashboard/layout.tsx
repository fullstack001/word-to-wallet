"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard redirectTo="/login" requireAuth={true}>
      {children}
    </AuthGuard>
  );
}
