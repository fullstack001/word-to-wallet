"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import LandingPageBuilderForm from "@/components/LandingPageBuilderForm";
import { landingPageApi, LandingPage } from "@/services/landingPageApi";
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
  console.log(landingPages);

  const fetchLandingPages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await landingPageApi.getLandingPages();
      setLandingPages(response.landingPages);
    } catch (error) {
      console.error("Failed to fetch landing pages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchLandingPages();
  }, [isLoggedIn, fetchLandingPages]);

  const handlePageCreated = async (pageData: any) => {
    try {
      const newPage = await landingPageApi.createLandingPage(pageData);
      setLandingPages([newPage, ...landingPages]);
      setShowBuilder(false);
    } catch (error) {
      console.error("Failed to create landing page:", error);
      alert("Failed to create landing page. Please try again.");
    }
  };

  const handlePageUpdated = async (pageData: any) => {
    if (!editingPage) return;

    try {
      const updatedPage = await landingPageApi.updateLandingPage(
        editingPage.id,
        pageData
      );
      setLandingPages(
        landingPages.map((page) =>
          page.id === editingPage.id ? updatedPage : page
        )
      );
      setShowBuilder(false);
      setEditingPage(null);
    } catch (error) {
      console.error("Failed to update landing page:", error);
      alert("Failed to update landing page. Please try again.");
    }
  };

  const handleEditPage = (page: LandingPage) => {
    setEditingPage(page);
    setShowBuilder(true);
  };

  const handleDeletePage = async (pageId: string) => {
    if (window.confirm("Are you sure you want to delete this landing page?")) {
      try {
        await landingPageApi.deleteLandingPage(pageId);
        setLandingPages(landingPages.filter((page) => page.id !== pageId));
      } catch (error) {
        console.error("Failed to delete landing page:", error);
        alert("Failed to delete landing page. Please try again.");
      }
    }
  };

  const handlePublishPage = async (pageId: string) => {
    try {
      const updatedPage = await landingPageApi.updateLandingPageStatus(
        pageId,
        true
      );
      setLandingPages(
        landingPages.map((page) => (page.id === pageId ? updatedPage : page))
      );
    } catch (error) {
      console.error("Failed to publish landing page:", error);
      alert("Failed to publish landing page. Please try again.");
    }
  };

  const handleUnpublishPage = async (pageId: string) => {
    try {
      const updatedPage = await landingPageApi.updateLandingPageStatus(
        pageId,
        false
      );
      setLandingPages(
        landingPages.map((page) => (page.id === pageId ? updatedPage : page))
      );
    } catch (error) {
      console.error("Failed to unpublish landing page:", error);
      alert("Failed to unpublish landing page. Please try again.");
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

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "text-green-600 bg-green-50"
      : "text-yellow-600 bg-yellow-50";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Published" : "Draft";
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

  const getPublicUrl = (page: LandingPage) => {
    return `/landing/${page.slug}`;
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
        <LandingPageBuilderForm
          onBack={() => {
            setShowBuilder(false);
            setEditingPage(null);
          }}
          className="mt-32"
        />
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
            onClick={() => navigate("/delivery")}
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
                            page.isActive
                          )}`}
                        >
                          {getStatusText(page.isActive)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {typeof page.book === "object"
                          ? page.book.title
                          : "Book not found"}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>
                            {page.analytics.totalViews.toLocaleString()} views
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {page.analytics.totalConversions} conversions (
                            {getConversionRate(
                              page.analytics.totalViews,
                              page.analytics.totalConversions
                            )}
                            )
                          </span>
                        </div>
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_LANDINGPAGE_VIEW_URL}/${page.id}`,
                            "_blank"
                          )
                        }
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {page.isActive && (
                        <button
                          onClick={() => handleCopyUrl(getPublicUrl(page))}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Copy Public URL"
                        >
                          {copiedUrl === getPublicUrl(page) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      {page.isActive && (
                        <button
                          onClick={() =>
                            window.open(getPublicUrl(page), "_blank")
                          }
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
                      {!page.isActive ? (
                        <button
                          onClick={() => handlePublishPage(page.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublishPage(page.id)}
                          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Unpublish
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
                <li key="design-1">
                  Use compelling headlines and clear value propositions
                </li>
                <li key="design-2">Include social proof and testimonials</li>
                <li key="design-3">
                  Make the download button prominent and clear
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Conversion Optimization</h4>
              <ul className="list-disc list-inside space-y-1">
                <li key="conversion-1">
                  Keep forms simple and minimize required fields
                </li>
                <li key="conversion-2">Use email capture strategically</li>
                <li key="conversion-3">
                  Test different headlines and call-to-action buttons
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
