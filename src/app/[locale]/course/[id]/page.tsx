"use client";

import React from "react";
import { useParams } from "next/navigation";
import CourseView from "@/components/CourseView";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  return (
    <AuthGuard
      redirectTo="/signup"
      requireAuth={true}
      requireSubscription={true}
    >
      <CourseView courseId={courseId} />
    </AuthGuard>
  );
}
