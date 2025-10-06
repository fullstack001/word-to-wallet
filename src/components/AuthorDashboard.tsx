"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Link,
  BarChart3,
  Upload,
  Plus,
  Eye,
  Download,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  FileText,
  Music,
  Globe,
} from "lucide-react";
import BookCreationWizard from "./BookCreationWizard";
import LandingPageBuilder from "./LandingPageBuilder";
import LinkGenerator from "./LinkGenerator";
import AnalyticsDashboard from "./AnalyticsDashboard";

interface AuthorDashboardProps {
  userId: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  fileType: "epub" | "pdf" | "audio";
  status: string;
  uploadDate: string;
  coverImageUrl?: string;
  isPublic: boolean;
  allowEmailCapture: boolean;
}

interface DeliveryLink {
  _id: string;
  title: string;
  slug: string;
  url: string;
  isActive: boolean;
  analytics: {
    totalViews: number;
    totalDownloads: number;
    emailCaptures: number;
  };
  createdAt: string;
}

interface LandingPage {
  _id: string;
  title: string;
  slug: string;
  url: string;
  isActive: boolean;
  analytics: {
    totalViews: number;
    totalConversions: number;
  };
  createdAt: string;
}

interface DashboardStats {
  totalBooks: number;
  totalDeliveryLinks: number;
  totalLandingPages: number;
  totalViews: number;
  totalDownloads: number;
  totalEmailCaptures: number;
  recentActivity: Array<{
    type: "book" | "link" | "page";
    title: string;
    date: string;
    action: string;
  }>;
}

const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "books"
    | "links"
    | "pages"
    | "analytics"
    | "upload"
    | "builder"
    | "generator"
  >("overview");
  const [books, setBooks] = useState<Book[]>([]);
  const [deliveryLinks, setDeliveryLinks] = useState<DeliveryLink[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [showLandingPageBuilder, setShowLandingPageBuilder] = useState(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch books
      const booksResponse = await fetch("/api/books");
      if (booksResponse.ok) {
        const booksResult = await booksResponse.json();
        setBooks(booksResult.data.books || []);
      }

      // Fetch delivery links
      const linksResponse = await fetch("/api/delivery-links");
      if (linksResponse.ok) {
        const linksResult = await linksResponse.json();
        setDeliveryLinks(linksResult.data.deliveryLinks || []);
      }

      // Fetch landing pages
      const pagesResponse = await fetch("/api/landing-pages");
      if (pagesResponse.ok) {
        const pagesResult = await pagesResponse.json();
        setLandingPages(pagesResult.data.landingPages || []);
      }

      // Fetch analytics overview
      const analyticsResponse = await fetch("/api/analytics/user");
      if (analyticsResponse.ok) {
        const analyticsResult = await analyticsResponse.json();
        setStats({
          totalBooks: analyticsResult.data.overview.totalBooks,
          totalDeliveryLinks: analyticsResult.data.overview.totalDeliveryLinks,
          totalLandingPages: analyticsResult.data.overview.totalLandingPages,
          totalViews: analyticsResult.data.overview.totalViews,
          totalDownloads: analyticsResult.data.overview.totalDownloads,
          totalEmailCaptures: analyticsResult.data.overview.totalEmailCaptures,
          recentActivity: [], // This would be populated from a separate endpoint
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "audio":
        return <Music className="w-5 h-5 text-purple-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleBookUpload = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
    setShowUploadWizard(false);
    setActiveTab("books");
  };

  const handleLinkCreated = (link: DeliveryLink) => {
    setDeliveryLinks((prev) => [link, ...prev]);
    setShowLinkGenerator(false);
    setActiveTab("links");
  };

  const handleLandingPageCreated = (page: LandingPage) => {
    setLandingPages((prev) => [page, ...prev]);
    setShowLandingPageBuilder(false);
    setActiveTab("pages");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalBooks || 0}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Delivery Links
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalDeliveryLinks || 0}
              </p>
            </div>
            <Link className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Landing Pages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalLandingPages || 0}
              </p>
            </div>
            <Globe className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats?.totalViews || 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUploadWizard(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium">Upload Book</p>
              <p className="text-sm text-gray-600">
                Add a new book to your library
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowLinkGenerator(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Link className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium">Create Link</p>
              <p className="text-sm text-gray-600">Generate a delivery link</p>
            </div>
          </button>

          <button
            onClick={() => setShowLandingPageBuilder(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Globe className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium">Build Landing Page</p>
              <p className="text-sm text-gray-600">
                Create a book landing page
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Books */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Books</h2>
          <button
            onClick={() => setActiveTab("books")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {books.slice(0, 5).map((book) => (
            <div
              key={book._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileTypeIcon(book.fileType)}
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatDate(book.uploadDate)}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === "ready"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Delivery Links */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Delivery Links</h2>
          <button
            onClick={() => setActiveTab("links")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {deliveryLinks.slice(0, 5).map((link) => (
            <div
              key={link._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Link className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <p className="text-sm text-gray-600">/{link.slug}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatNumber(link.analytics.totalViews)} views
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    link.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {link.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBooks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
        <button
          onClick={() => setShowUploadWizard(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Book</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getFileTypeIcon(book.fileType)}
                <div>
                  <h3 className="font-semibold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  book.status === "ready"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {book.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="capitalize">{book.fileType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploaded:</span>
                <span>{formatDate(book.uploadDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Public:</span>
                <span>{book.isPublic ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setShowLinkGenerator(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                <Link className="w-4 h-4" />
                <span>Create Link</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setShowLandingPageBuilder(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
              >
                <Globe className="w-4 h-4" />
                <span>Landing Page</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeliveryLinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Links</h2>
        <button
          onClick={() => setShowLinkGenerator(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Link</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Captures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveryLinks.map((link) => (
                <tr key={link._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {link.title}
                      </div>
                      <div className="text-sm text-gray-500">/{link.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        link.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(link.analytics.totalViews)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(link.analytics.totalDownloads)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(link.analytics.emailCaptures)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(link.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLandingPages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Landing Pages</h2>
        <button
          onClick={() => setShowLandingPageBuilder(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landingPages.map((page) => (
          <div key={page._id} className="bg-white p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{page.title}</h3>
                  <p className="text-sm text-gray-600">/{page.slug}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  page.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {page.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Views:</span>
                <span>{formatNumber(page.analytics.totalViews)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Conversions:</span>
                <span>{formatNumber(page.analytics.totalConversions)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span>{formatDate(page.createdAt)}</span>
              </div>
            </div>

            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
            >
              <Eye className="w-4 h-4" />
              <span>View Page</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your books, create delivery links, and track your performance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "books", label: "Books", icon: BookOpen },
              { id: "links", label: "Delivery Links", icon: Link },
              { id: "pages", label: "Landing Pages", icon: Globe },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "books" && renderBooks()}
          {activeTab === "links" && renderDeliveryLinks()}
          {activeTab === "pages" && renderLandingPages()}
          {activeTab === "analytics" && <AnalyticsDashboard userId={userId} />}
        </div>

        {/* Modals */}
        {showUploadWizard && (
          <BookCreationWizard
            onComplete={() => {
              setShowUploadWizard(false);
              setActiveTab("books");
            }}
            onClose={() => setShowUploadWizard(false)}
          />
        )}

        {showLandingPageBuilder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Landing Page Builder
                  </h2>
                  <button
                    onClick={() => setShowLandingPageBuilder(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <LandingPageBuilder
                  bookId={selectedBook?._id || ""}
                  onSave={handleLandingPageCreated}
                  onClose={() => setShowLandingPageBuilder(false)}
                />
              </div>
            </div>
          </div>
        )}

        {showLinkGenerator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Link Generator
                  </h2>
                  <button
                    onClick={() => setShowLinkGenerator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <LinkGenerator
                  bookId={selectedBook?._id || ""}
                  onLinkCreated={handleLinkCreated}
                  onClose={() => setShowLinkGenerator(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;
