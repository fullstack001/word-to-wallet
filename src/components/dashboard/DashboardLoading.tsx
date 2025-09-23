"use client";

import { PageLoading } from "../common/Loading";

interface DashboardLoadingProps {
  message?: string;
}

export default function DashboardLoading({
  message = "Loading your dashboard...",
}: DashboardLoadingProps) {
  return <PageLoading message={message} />;
}
