"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Mail,
  Users,
  Calendar,
  Filter,
  Download as DownloadIcon,
  RefreshCw,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalDownloads: number;
    totalEmailCaptures: number;
    conversionRate: number;
    viewsChange: number;
    downloadsChange: number;
    emailCapturesChange: number;
    conversionRateChange: number;
  };
  topBooks: Array<{
    id: string;
    title: string;
    views: number;
    downloads: number;
    emailCaptures: number;
    conversionRate: number;
  }>;
  topLandingPages: Array<{
    id: string;
    title: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>;
  topDeliveryLinks: Array<{
    id: string;
    title: string;
    views: number;
    downloads: number;
    conversionRate: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    downloads: number;
    emailCaptures: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countryStats: Array<{
    country: string;
    views: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchAnalyticsData();
  }, [isLoggedIn, navigate, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setAnalyticsData({
        overview: {
          totalViews: 15420,
          totalDownloads: 3240,
          totalEmailCaptures: 890,
          conversionRate: 21.0,
          viewsChange: 12.5,
          downloadsChange: 8.3,
          emailCapturesChange: 15.7,
          conversionRateChange: -2.1,
        },
        topBooks: [
          {
            id: "1",
            title: "The Complete Guide to Digital Marketing",
            views: 4560,
            downloads: 1234,
            emailCaptures: 456,
            conversionRate: 27.0,
          },
          {
            id: "2",
            title: "Advanced SEO Techniques",
            views: 3240,
            downloads: 890,
            emailCaptures: 234,
            conversionRate: 27.5,
          },
          {
            id: "3",
            title: "Content Marketing Mastery",
            views: 2890,
            downloads: 567,
            emailCaptures: 123,
            conversionRate: 19.6,
          },
        ],
        topLandingPages: [
          {
            id: "1",
            title: "Digital Marketing Mastery",
            views: 2340,
            conversions: 456,
            conversionRate: 19.5,
          },
          {
            id: "2",
            title: "SEO Secrets Revealed",
            views: 1890,
            conversions: 234,
            conversionRate: 12.4,
          },
          {
            id: "3",
            title: "Content Marketing Playbook",
            views: 1560,
            conversions: 189,
            conversionRate: 12.1,
          },
        ],
        topDeliveryLinks: [
          {
            id: "1",
            title: "Digital Marketing Guide - Premium Access",
            views: 1234,
            downloads: 456,
            conversionRate: 37.0,
          },
          {
            id: "2",
            title: "SEO Techniques - Public Access",
            views: 890,
            downloads: 234,
            conversionRate: 26.3,
          },
          {
            id: "3",
            title: "Content Marketing - Password Protected",
            views: 567,
            downloads: 123,
            conversionRate: 21.7,
          },
        ],
        dailyStats: [
          { date: "2024-01-10", views: 450, downloads: 89, emailCaptures: 23 },
          { date: "2024-01-11", views: 520, downloads: 102, emailCaptures: 28 },
          { date: "2024-01-12", views: 480, downloads: 95, emailCaptures: 25 },
          { date: "2024-01-13", views: 610, downloads: 128, emailCaptures: 32 },
          { date: "2024-01-14", views: 580, downloads: 115, emailCaptures: 29 },
          { date: "2024-01-15", views: 650, downloads: 142, emailCaptures: 35 },
          { date: "2024-01-16", views: 720, downloads: 158, emailCaptures: 41 },
        ],
        deviceStats: {
          desktop: 65.2,
          mobile: 28.7,
          tablet: 6.1,
        },
        countryStats: [
          { country: "United States", views: 4560, percentage: 29.6 },
          { country: "United Kingdom", views: 2340, percentage: 15.2 },
          { country: "Canada", views: 1890, percentage: 12.3 },
          { country: "Australia", views: 1230, percentage: 8.0 },
          { country: "Germany", views: 980, percentage: 6.4 },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const handleExportData = () => {
    // Implement data export functionality
    console.log("Exporting analytics data...");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) {
      return "text-green-600";
    } else if (change < 0) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No analytics data available
            </h3>
            <p className="text-gray-600">
              Start creating content to see your analytics
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/delivery")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Delivery Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">
                Track your book delivery performance and insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Refresh Data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.overview.totalViews)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(analyticsData.overview.viewsChange)}
              <span
                className={`text-sm font-medium ml-1 ${getChangeColor(
                  analyticsData.overview.viewsChange
                )}`}
              >
                {analyticsData.overview.viewsChange > 0 ? "+" : ""}
                {analyticsData.overview.viewsChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.overview.totalDownloads)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(analyticsData.overview.downloadsChange)}
              <span
                className={`text-sm font-medium ml-1 ${getChangeColor(
                  analyticsData.overview.downloadsChange
                )}`}
              >
                {analyticsData.overview.downloadsChange > 0 ? "+" : ""}
                {analyticsData.overview.downloadsChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Email Captures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.overview.totalEmailCaptures)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(analyticsData.overview.emailCapturesChange)}
              <span
                className={`text-sm font-medium ml-1 ${getChangeColor(
                  analyticsData.overview.emailCapturesChange
                )}`}
              >
                {analyticsData.overview.emailCapturesChange > 0 ? "+" : ""}
                {analyticsData.overview.emailCapturesChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.conversionRate}%
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(analyticsData.overview.conversionRateChange)}
              <span
                className={`text-sm font-medium ml-1 ${getChangeColor(
                  analyticsData.overview.conversionRateChange
                )}`}
              >
                {analyticsData.overview.conversionRateChange > 0 ? "+" : ""}
                {analyticsData.overview.conversionRateChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Books
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900 truncate">
                          {book.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatNumber(book.views)} views</span>
                        <span>{formatNumber(book.downloads)} downloads</span>
                        <span>{book.conversionRate}% conversion</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Landing Pages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Landing Pages
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topLandingPages.map((page, index) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900 truncate">
                          {page.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatNumber(page.views)} views</span>
                        <span>
                          {formatNumber(page.conversions)} conversions
                        </span>
                        <span>{page.conversionRate}% rate</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Delivery Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Delivery Links
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topDeliveryLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900 truncate">
                          {link.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatNumber(link.views)} views</span>
                        <span>{formatNumber(link.downloads)} downloads</span>
                        <span>{link.conversionRate}% rate</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Device and Country Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Traffic by Device
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Desktop
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {analyticsData.deviceStats.desktop}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceStats.desktop}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Mobile
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {analyticsData.deviceStats.mobile}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceStats.mobile}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Tablet
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {analyticsData.deviceStats.tablet}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceStats.tablet}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Country Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Countries
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.countryStats.map((country, index) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {country.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {formatNumber(country.views)} views
                        </span>
                        <span className="text-sm text-gray-500">
                          ({country.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.dailyStats.map((day, index) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-600 w-20">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Views</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatNumber(day.views)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Downloads</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatNumber(day.downloads)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Emails</p>
                          <p className="text-lg font-bold text-purple-600">
                            {formatNumber(day.emailCaptures)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
