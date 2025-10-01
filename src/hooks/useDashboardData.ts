"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUser, updateSubscription } from "../store/slices/userSlice";

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: {
    name: string;
  };
  isPublished: boolean;
  createdAt: string;
  progress?: number;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
}

interface DashboardData {
  courses: Course[];
  stats: DashboardStats;
  subscription?: any;
}

interface UseDashboardDataReturn {
  courses: Course[];
  stats: DashboardStats;
  isLoading: boolean;
  hasError: boolean;
  isDataFetched: boolean;
  fetchData: () => Promise<void>;
  retry: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalTimeSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);

  const fetchData = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoading || requestInProgress || isDataFetched) {
      console.log("Request already in progress or data already fetched");
      return;
    }

    try {
      console.log("Starting dashboard data fetch...");
      setIsLoading(true);
      setRequestInProgress(true);
      setHasError(false);

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found, redirecting to login");
        return;
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

      console.log("Fetching from:", `${API_BASE_URL}/dashboard`);

      const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard response status:", dashboardResponse.status);

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log("Dashboard data received:", dashboardData);

        const {
          stats: fetchedStats,
          courses: fetchedCourses,
          subscription,
        } = dashboardData.data;

        setCourses(fetchedCourses || []);
        setStats(
          fetchedStats || {
            totalCourses: 0,
            completedCourses: 0,
            inProgressCourses: 0,
            totalTimeSpent: 0,
          }
        );

        // Update user subscription info in Redux if available
        if (subscription) {
          dispatch(
            updateSubscription({
              stripeCustomerId: subscription.stripeCustomerId,
              stripeSubscriptionId: subscription.stripeSubscriptionId,
              status: subscription.status,
              plan: subscription.plan,
              trialStart: subscription.trialStart,
              trialEnd: subscription.trialEnd,
              currentPeriodStart: subscription.currentPeriodStart,
              currentPeriodEnd: subscription.currentPeriodEnd,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
              canceledAt: subscription.canceledAt,
            })
          );
        }
        console.log("Dashboard data set successfully");
      } else {
        console.error("Dashboard API failed:", dashboardResponse.status);
        const errorText = await dashboardResponse.text();
        console.error("Error response:", errorText);

        setHasError(true);
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalTimeSpent: 0,
        });
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setHasError(true);
      setStats({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalTimeSpent: 0,
      });
      setCourses([]);
    } finally {
      console.log("Dashboard fetch completed, setting loading to false");
      setIsLoading(false);
      setRequestInProgress(false);
      setIsDataFetched(true);
    }
  }, [isLoading, requestInProgress, isDataFetched, dispatch]);

  const retry = useCallback(() => {
    setHasError(false);
    setIsDataFetched(false);
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !isDataFetched) {
        console.log("Dashboard loading timeout, setting error state");
        setHasError(true);
        setIsLoading(false);
        setRequestInProgress(false);
        setIsDataFetched(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, isDataFetched]);

  // Fallback: if no data after 5 seconds, show basic dashboard
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading && !isDataFetched && !hasError) {
        console.log("Showing fallback dashboard with basic data");
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalTimeSpent: 0,
        });
        setCourses([]);
        setIsLoading(false);
        setRequestInProgress(false);
        setIsDataFetched(true);
      }
    }, 5000); // 5 second fallback

    return () => clearTimeout(fallbackTimeout);
  }, [isLoading, isDataFetched, hasError]);

  return {
    courses,
    stats,
    isLoading,
    hasError,
    isDataFetched,
    fetchData,
    retry,
  };
}
