"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import {
  ArrowLeft,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";

interface LandingPage {
  id: string;
  title: string;
  bookTitle: string;
  status: "draft" | "published" | "archived";
  views: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
  previewUrl?: string;
  publicUrl?: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
}

export default function LandingPageBuilderPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [landingPageType, setLandingPageType] =
    useState<string>("email_signup");
  const [emailSignupOption, setEmailSignupOption] =
    useState<string>("required");
  const [books, setBooks] = useState<Book[]>([]);

  const fetchLandingPages = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setLandingPages([
        {
          id: "1",
          title: "Digital Marketing Mastery",
          bookTitle: "The Complete Guide to Digital Marketing",
          status: "published",
          views: 1234,
          conversions: 89,
          createdAt: "2024-01-10T10:30:00Z",
          updatedAt: "2024-01-15T14:20:00Z",
          previewUrl: "/preview/landing/1",
          publicUrl: "/landing/digital-marketing-mastery",
        },
        {
          id: "2",
          title: "SEO Secrets Revealed",
          bookTitle: "Advanced SEO Techniques",
          status: "draft",
          views: 0,
          conversions: 0,
          createdAt: "2024-01-14T15:45:00Z",
          updatedAt: "2024-01-16T09:15:00Z",
          previewUrl: "/preview/landing/2",
        },
        {
          id: "3",
          title: "Content Marketing Playbook",
          bookTitle: "Content Marketing Mastery",
          status: "published",
          views: 856,
          conversions: 67,
          createdAt: "2024-01-12T11:20:00Z",
          updatedAt: "2024-01-16T16:30:00Z",
          previewUrl: "/preview/landing/3",
          publicUrl: "/landing/content-marketing-playbook",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch landing pages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBooks(data.data.books || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchLandingPages();
    fetchBooks();
  }, [isLoggedIn, fetchLandingPages, fetchBooks]);

  const handlePageCreated = (pageData: any) => {
    const newPage: LandingPage = {
      id: Date.now().toString(),
      title: pageData.title,
      bookTitle: pageData.bookTitle,
      status: "draft",
      views: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      previewUrl: `/preview/landing/${Date.now()}`,
    };
    setLandingPages([newPage, ...landingPages]);
    setShowBuilder(false);
  };

  const handlePageUpdated = (pageData: any) => {
    setLandingPages(
      landingPages.map((page) =>
        page.id === editingPage?.id
          ? {
              ...page,
              ...pageData,
              updatedAt: new Date().toISOString(),
            }
          : page
      )
    );
    setShowBuilder(false);
    setEditingPage(null);
  };

  const handleEditPage = (page: LandingPage) => {
    setEditingPage(page);
    setShowBuilder(true);
  };

  const handleDeletePage = async (pageId: string) => {
    if (window.confirm("Are you sure you want to delete this landing page?")) {
      try {
        // API call to delete page
        setLandingPages(landingPages.filter((page) => page.id !== pageId));
      } catch (error) {
        console.error("Failed to delete landing page:", error);
      }
    }
  };

  const handlePublishPage = async (pageId: string) => {
    try {
      // API call to publish page
      setLandingPages(
        landingPages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                status: "published" as const,
                publicUrl: `/landing/${page.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
                updatedAt: new Date().toISOString(),
              }
            : page
        )
      );
    } catch (error) {
      console.error("Failed to publish landing page:", error);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-50";
      case "draft":
        return "text-yellow-600 bg-yellow-50";
      case "archived":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getConversionRate = (views: number, conversions: number) => {
    if (views === 0) return "0%";
    return `${((conversions / views) * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showBuilder) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 mt-32">
          <div className="mb-8">
            <button
              onClick={() => {
                setShowBuilder(false);
                setEditingPage(null);
                setSelectedBook("");
                setLandingPageType("email_signup");
                setEmailSignupOption("required");
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing Pages</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Landing Page Builder
            </h1>
            <p className="text-gray-600">
              Create a new download page for your book
            </p>
          </div>

          {/* Book Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Which book do you want to create a new download page for?
            </h2>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a book...</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>

          {/* Landing Page Type Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What kind of landing page do you want to create?
            </h2>

            <div className="space-y-4">
              {/* Email Signup Page */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="landingPageType"
                    value="email_signup"
                    checked={landingPageType === "email_signup"}
                    onChange={(e) => setLandingPageType(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      An email signup page to collect new readers
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Word2Wallet will collect the reader's email address before
                      they can receive their book.
                    </div>

                    {landingPageType === "email_signup" && (
                      <div className="mt-4 pl-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Do you want to <strong>require</strong> the reader to
                          join your mailing list, or should the reader have the{" "}
                          <strong>option</strong> of joining?
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="emailSignupOption"
                              value="required"
                              checked={emailSignupOption === "required"}
                              onChange={(e) =>
                                setEmailSignupOption(e.target.value)
                              }
                            />
                            <span className="text-sm">
                              The reader is required to join my list in order to
                              receive the book
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="emailSignupOption"
                              value="optional"
                              checked={emailSignupOption === "optional"}
                              onChange={(e) =>
                                setEmailSignupOption(e.target.value)
                              }
                            />
                            <span className="text-sm">
                              The reader has the option to join my list and will
                              still receive the book
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="emailSignupOption"
                              value="data_collection"
                              checked={emailSignupOption === "data_collection"}
                              onChange={(e) =>
                                setEmailSignupOption(e.target.value)
                              }
                            />
                            <span className="text-sm">
                              The reader can download the book and is not
                              signing up for a list (for data collection only)
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Simple Download Page */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="landingPageType"
                    value="simple_download"
                    checked={landingPageType === "simple_download"}
                    onChange={(e) => setLandingPageType(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      A simple download page without email collection
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Readers will be allowed to download without having to
                      enter their email address at all. This means that you
                      won't be able to track who is downloading, but it is the
                      simplest way to distribute a book to readers.
                    </div>
                  </div>
                </label>
              </div>

              {/* Universal Book Link */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="landingPageType"
                    value="universal_link"
                    checked={landingPageType === "universal_link"}
                    onChange={(e) => setLandingPageType(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      A universal book link where readers can choose from a list
                      of formats and bookstores online to buy your book
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Readers will be redirected to a bookstore or to your own
                      store or website in order to get their book. Word2Wallet
                      does not deliver any files with this kind of page, we're
                      only hosting the landing page and then directing the
                      reader where to go.
                    </div>
                  </div>
                </label>
              </div>

              {/* Restricted Landing Page */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="landingPageType"
                    value="restricted"
                    checked={landingPageType === "restricted"}
                    onChange={(e) => setLandingPageType(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      A restricted landing page for current subscribers
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Readers will be asked to give their email address, and
                      then Word2Wallet will confirm that they are actively
                      subscribed to one of your integrated lists before allowing
                      them to download the book. New readers (not already on
                      your list) will not be able to sign up for your list or
                      download the content.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-start">
            <button
              onClick={() => {
                if (!selectedBook) {
                  alert("Please select a book first");
                  return;
                }
                // Navigate to the actual landing page builder with the selected options
                navigate(
                  `/delivery/landing-builder/create?bookId=${selectedBook}&type=${landingPageType}&emailOption=${emailSignupOption}`
                );
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              Create Landing Page
            </button>
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
          <button
            onClick={() => navigate("/dashboard/delivery")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Delivery Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Landing Page Builder
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage landing pages for your books
              </p>
            </div>
            <button
              onClick={() => setShowBuilder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Landing Page</span>
            </button>
          </div>
        </div>

        {/* Landing Pages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Landing Pages
            </h2>
            <p className="text-gray-600">
              Manage your book landing pages and track their performance
            </p>
          </div>
          <div className="p-6">
            {landingPages.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No landing pages created yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first landing page to promote your books
                </p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Landing Page
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {landingPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {page.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            page.status
                          )}`}
                        >
                          {page.status.charAt(0).toUpperCase() +
                            page.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{page.bookTitle}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{page.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {page.conversions} conversions (
                            {getConversionRate(page.views, page.conversions)})
                          </span>
                        </div>
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {page.previewUrl && (
                        <button
                          onClick={() => window.open(page.previewUrl, "_blank")}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {page.publicUrl && (
                        <button
                          onClick={() => handleCopyUrl(page.publicUrl!)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Copy Public URL"
                        >
                          {copiedUrl === page.publicUrl ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      {page.publicUrl && (
                        <button
                          onClick={() => window.open(page.publicUrl, "_blank")}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditPage(page)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {page.status === "draft" && (
                        <button
                          onClick={() => handlePublishPage(page.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Landing Page Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Design Best Practices</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Use compelling headlines and clear value propositions</li>
                <li>Include social proof and testimonials</li>
                <li>Make the download button prominent and clear</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Conversion Optimization</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep forms simple and minimize required fields</li>
                <li>Use email capture strategically</li>
                <li>Test different headlines and call-to-action buttons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
