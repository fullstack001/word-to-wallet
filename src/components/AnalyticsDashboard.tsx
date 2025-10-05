"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Mail,
  Eye,
  Calendar,
  Filter,
  Download as DownloadIcon,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

interface AnalyticsDashboardProps {
  bookId?: string;
  userId: string;
}

interface AnalyticsData {
  overview: {
    totalBooks: number;
    totalDeliveryLinks: number;
    totalLandingPages: number;
    totalEmailCaptures: number;
    totalViews: number;
    totalDownloads: number;
    totalConversions: number;
    uniqueVisitors: number;
  };
  eventsByType: Record<string, number>;
  eventsByDate: Record<string, number>;
  topBooks: Array<{
    _id: string;
    title: string;
    author: string;
    views: number;
    downloads: number;
    conversions: number;
  }>;
  topDeliveryLinks: Array<{
    _id: string;
    title: string;
    slug: string;
    views: number;
    downloads: number;
    emailCaptures: number;
  }>;
  topLandingPages: Array<{
    _id: string;
    title: string;
    slug: string;
    views: number;
    conversions: number;
    uniqueVisitors: number;
  }>;
  deviceBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  conversionFunnel: {
    views: number;
    emailCaptures: number;
    downloads: number;
    conversions: number;
    emailCaptureRate: number;
    downloadRate: number;
    conversionRate: number;
  };
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  bookId,
  userId,
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("views");
  const [timeframe, setTimeframe] = useState("day");

  useEffect(() => {
    fetchAnalytics();
  }, [bookId, userId, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy: timeframe,
      });

      if (bookId) {
        params.append("bookId", bookId);
      }

      const response = await fetch(`/api/analytics/user?${params}`);
      if (response.ok) {
        const result = await response.json();
        setAnalyticsData(result.data);
      } else {
        console.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format: "csv" | "json") => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
      });

      if (bookId) {
        params.append("bookId", bookId);
      }

      const response = await fetch(`/api/analytics/export?${params}`);
      if (response.ok) {
        if (format === "csv") {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `analytics-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `analytics-${
            new Date().toISOString().split("T")[0]
          }.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error("Error exporting analytics:", error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Analytics Data
        </h3>
        <p className="text-gray-600">
          Start sharing your books to see analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your book performance and reader engagement
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => exportAnalytics("csv")}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportAnalytics("json")}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalViews)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalDownloads)}
              </p>
            </div>
            <Download className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Email Captures
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalEmailCaptures)}
              </p>
            </div>
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unique Visitors
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.uniqueVisitors)}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(analyticsData.conversionFunnel.views)}
            </div>
            <div className="text-sm text-gray-600">Views</div>
            <div className="text-xs text-gray-500">100%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(analyticsData.conversionFunnel.emailCaptures)}
            </div>
            <div className="text-sm text-gray-600">Email Captures</div>
            <div className="text-xs text-gray-500">
              {analyticsData.conversionFunnel.emailCaptureRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(analyticsData.conversionFunnel.downloads)}
            </div>
            <div className="text-sm text-gray-600">Downloads</div>
            <div className="text-xs text-gray-500">
              {analyticsData.conversionFunnel.downloadRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(analyticsData.conversionFunnel.conversions)}
            </div>
            <div className="text-sm text-gray-600">Conversions</div>
            <div className="text-xs text-gray-500">
              {analyticsData.conversionFunnel.conversionRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Top Performing Books</h2>
          <div className="space-y-3">
            {analyticsData.topBooks.slice(0, 5).map((book, index) => (
              <div key={book._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(book.views)} views
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatNumber(book.downloads)} downloads
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(analyticsData.deviceBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device)}
                    <span className="capitalize text-gray-900">{device}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (count /
                              Math.max(
                                ...Object.values(analyticsData.deviceBreakdown)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {formatNumber(count)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Delivery Links */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Top Delivery Links</h2>
          <div className="space-y-3">
            {analyticsData.topDeliveryLinks.slice(0, 5).map((link, index) => (
              <div key={link._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{link.title}</p>
                    <p className="text-sm text-gray-600">/{link.slug}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(link.views)} views
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatNumber(link.downloads)} downloads
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Top Countries</h2>
          <div className="space-y-3">
            {Object.entries(analyticsData.countryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([country, count]) => (
                <div
                  key={country}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (count /
                              Math.max(
                                ...Object.values(analyticsData.countryBreakdown)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {formatNumber(count)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Events by Date Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Activity Over Time</h2>
        <div className="h-64 flex items-end space-x-1">
          {Object.entries(analyticsData.eventsByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .slice(-30)
            .map(([date, count]) => {
              const maxCount = Math.max(
                ...Object.values(analyticsData.eventsByDate)
              );
              const height = (count / maxCount) * 100;

              return (
                <div key={date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={`${date}: ${count} events`}
                  />
                  <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
