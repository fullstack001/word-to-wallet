"use client";

import React from "react";
import { useParams } from "next/navigation";
import CourseView from "@/components/CourseView";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  return <CourseView courseId={courseId} />;
}
