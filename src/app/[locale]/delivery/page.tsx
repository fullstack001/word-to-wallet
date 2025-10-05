"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { deliveryApi, BookDeliveryStats } from "../../../services/deliveryApi";
import {
  BookOpen,
  Upload,
  Link,
  BarChart3,
  Mail,
  Eye,
  Download,
  Users,
  TrendingUp,
  Plus,
  Settings,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";

// BookDeliveryStats interface is now imported from deliveryApi

export default function BookDeliveryDashboard() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);
  console.log(isLoggedIn);

  const [stats, setStats] = useState<BookDeliveryStats>({
    totalBooks: 0,
    totalLinks: 0,
    totalDownloads: 0,
    totalViews: 0,
    totalEmailCaptures: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasInitialized = useRef(false);

  const fetchDeliveryStats = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetching) {
      console.log("Already fetching data, skipping request");
      return;
    }

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      // Fetch only the essential stats from backend
      const statsData = await deliveryApi.getDeliveryStats();

      // Set stats with empty recent activity for now to avoid multiple requests
      setStats({
        ...statsData,
        recentActivity: [], // Will be loaded separately if needed
      });
    } catch (error) {
      console.error("Failed to fetch delivery stats:", error);
      setError("Failed to load delivery statistics. Please try again later.");
      // Set empty stats on error
      setStats({
        totalBooks: 0,
        totalLinks: 0,
        totalDownloads: 0,
        totalViews: 0,
        totalEmailCaptures: 0,
        recentActivity: [],
      });
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, []); // Remove isFetching dependency to prevent infinite loops

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Only fetch data once when component mounts
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchDeliveryStats();
    }
  }, [isLoggedIn, fetchDeliveryStats]); // Remove navigate from dependencies to prevent infinite loops

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4 text-blue-600" />;
      case "download":
        return <Download className="w-4 h-4 text-green-600" />;
      case "view":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "email_capture":
        return <Mail className="w-4 h-4 text-orange-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-blue-50 border-blue-200";
      case "download":
        return "bg-green-50 border-green-200";
      case "view":
        return "bg-purple-50 border-purple-200";
      case "email_capture":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl min-h-screen mx-auto px-4 py-8 mt-32">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 mt-32">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Data
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  deliveryApi.clearCache();
                  hasInitialized.current = false;
                  fetchDeliveryStats();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-32">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book Delivery Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your digital book distribution and track performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/delivery/book")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalBooks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Link className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Delivery Links
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalLinks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Email Captures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEmailCaptures}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate("/delivery/book")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Books
              </h3>
            </div>
            <p className="text-gray-600">
              Upload EPUB, PDF, or audio files for distribution
            </p>
          </button>

          <button
            onClick={() => navigate("/delivery/landing-builder")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Landing Pages
              </h3>
            </div>
            <p className="text-gray-600">
              Create and customize book landing pages
            </p>
          </button>

          <button
            onClick={() => navigate("/delivery/link-generator")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Link className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Generate Links
              </h3>
            </div>
            <p className="text-gray-600">
              Create secure delivery links with access controls
            </p>
          </button>

          <button
            onClick={() => navigate("/delivery/analytics")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Analytics
              </h3>
            </div>
            <p className="text-gray-600">
              View detailed performance metrics and insights
            </p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate("/delivery/analytics")}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <span>View All</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center p-4 rounded-lg border ${getActivityColor(
                    activity.type
                  )}`}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    {activity.details && (
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/delivery/email-captures")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Email Captures
              </h3>
            </div>
            <p className="text-gray-600">
              Manage and export captured reader emails
            </p>
          </button>

          <button
            onClick={() => navigate("/integrations")}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Integrations
              </h3>
            </div>
            <p className="text-gray-600">
              Connect email marketing and payment platforms
            </p>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
