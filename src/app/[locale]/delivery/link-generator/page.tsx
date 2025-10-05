"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LinkGenerator from "@/components/LinkGenerator";
import {
  ArrowLeft,
  Link,
  Copy,
  ExternalLink,
  Eye,
  Download,
  Calendar,
  Shield,
  Mail,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface DeliveryLink {
  id: string;
  title: string;
  description: string;
  bookTitle: string;
  url: string;
  shortUrl: string;
  accessType: "email_required" | "anonymous" | "password_protected";
  password?: string;
  maxDownloads?: number;
  currentDownloads: number;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  lastAccessed?: string;
  views: number;
  conversions: number;
}

export default function LinkGeneratorPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [deliveryLinks, setDeliveryLinks] = useState<DeliveryLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [editingLink, setEditingLink] = useState<DeliveryLink | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchDeliveryLinks();
  }, [isLoggedIn, navigate]);

  const fetchDeliveryLinks = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setDeliveryLinks([
        {
          id: "1",
          title: "Digital Marketing Guide - Premium Access",
          description:
            "Exclusive access to the complete digital marketing guide",
          bookTitle: "The Complete Guide to Digital Marketing",
          url: "https://word2wallet.com/delivery/abc123",
          shortUrl: "https://w2w.link/abc123",
          accessType: "email_required",
          maxDownloads: 100,
          currentDownloads: 45,
          expiryDate: "2024-12-31T23:59:59Z",
          isActive: true,
          createdAt: "2024-01-10T10:30:00Z",
          lastAccessed: "2024-01-16T14:20:00Z",
          views: 234,
          conversions: 45,
        },
        {
          id: "2",
          title: "SEO Techniques - Public Access",
          description: "Free access to advanced SEO techniques",
          bookTitle: "Advanced SEO Techniques",
          url: "https://word2wallet.com/delivery/def456",
          shortUrl: "https://w2w.link/def456",
          accessType: "anonymous",
          isActive: true,
          createdAt: "2024-01-14T15:45:00Z",
          lastAccessed: "2024-01-16T09:15:00Z",
          views: 567,
          conversions: 89,
        },
        {
          id: "3",
          title: "Content Marketing - Password Protected",
          description: "Password-protected access to content marketing guide",
          bookTitle: "Content Marketing Mastery",
          url: "https://word2wallet.com/delivery/ghi789",
          shortUrl: "https://w2w.link/ghi789",
          accessType: "password_protected",
          password: "content2024",
          maxDownloads: 50,
          currentDownloads: 23,
          isActive: true,
          createdAt: "2024-01-12T11:20:00Z",
          lastAccessed: "2024-01-15T16:30:00Z",
          views: 123,
          conversions: 23,
        },
        {
          id: "4",
          title: "Social Media Strategy - Expired",
          description: "Social media strategy guide (expired)",
          bookTitle: "Social Media Strategy",
          url: "https://word2wallet.com/delivery/jkl012",
          shortUrl: "https://w2w.link/jkl012",
          accessType: "email_required",
          maxDownloads: 25,
          currentDownloads: 25,
          expiryDate: "2024-01-15T23:59:59Z",
          isActive: false,
          createdAt: "2024-01-08T09:00:00Z",
          lastAccessed: "2024-01-15T22:45:00Z",
          views: 89,
          conversions: 25,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch delivery links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = (linkData: any) => {
    const newLink: DeliveryLink = {
      id: Date.now().toString(),
      title: linkData.title,
      description: linkData.description,
      bookTitle: linkData.bookTitle,
      url: `https://word2wallet.com/delivery/${Date.now()}`,
      shortUrl: `https://w2w.link/${Date.now().toString(36)}`,
      accessType: linkData.accessType,
      password: linkData.password,
      maxDownloads: linkData.maxDownloads,
      currentDownloads: 0,
      expiryDate: linkData.expiryDate,
      isActive: true,
      createdAt: new Date().toISOString(),
      views: 0,
      conversions: 0,
    };
    setDeliveryLinks([newLink, ...deliveryLinks]);
    setShowGenerator(false);
  };

  const handleLinkUpdated = (linkData: any) => {
    setDeliveryLinks(
      deliveryLinks.map((link) =>
        link.id === editingLink?.id
          ? {
              ...link,
              ...linkData,
            }
          : link
      )
    );
    setShowGenerator(false);
    setEditingLink(null);
  };

  const handleEditLink = (link: DeliveryLink) => {
    setEditingLink(link);
    setShowGenerator(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    if (window.confirm("Are you sure you want to delete this delivery link?")) {
      try {
        // API call to delete link
        setDeliveryLinks(deliveryLinks.filter((link) => link.id !== linkId));
      } catch (error) {
        console.error("Failed to delete delivery link:", error);
      }
    }
  };

  const handleToggleLinkStatus = async (linkId: string) => {
    try {
      // API call to toggle link status
      setDeliveryLinks(
        deliveryLinks.map((link) =>
          link.id === linkId ? { ...link, isActive: !link.isActive } : link
        )
      );
    } catch (error) {
      console.error("Failed to toggle link status:", error);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const getAccessTypeIcon = (accessType: string) => {
    switch (accessType) {
      case "email_required":
        return <Mail className="w-4 h-4 text-blue-600" />;
      case "password_protected":
        return <Shield className="w-4 h-4 text-orange-600" />;
      case "anonymous":
        return <ExternalLink className="w-4 h-4 text-green-600" />;
      default:
        return <Link className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case "email_required":
        return "text-blue-600 bg-blue-50";
      case "password_protected":
        return "text-orange-600 bg-orange-50";
      case "anonymous":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAccessTypeText = (accessType: string) => {
    switch (accessType) {
      case "email_required":
        return "Email Required";
      case "password_protected":
        return "Password Protected";
      case "anonymous":
        return "Public Access";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (isActive: boolean, expiryDate?: string) => {
    if (!isActive) return "text-red-600 bg-red-50";
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return "text-red-600 bg-red-50";
    }
    return "text-green-600 bg-green-50";
  };

  const getStatusText = (isActive: boolean, expiryDate?: string) => {
    if (!isActive) return "Inactive";
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return "Expired";
    }
    return "Active";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (showGenerator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => {
                setShowGenerator(false);
                setEditingLink(null);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Delivery Links</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingLink ? "Edit Delivery Link" : "Generate Delivery Link"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingLink
                ? "Update your delivery link settings"
                : "Create a secure delivery link for your book"}
            </p>
          </div>
          <LinkGenerator
            initialData={editingLink}
            onGenerate={editingLink ? handleLinkUpdated : handleLinkCreated}
            onCancel={() => {
              setShowGenerator(false);
              setEditingLink(null);
            }}
          />
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
              <h1 className="text-3xl font-bold text-gray-900">
                Delivery Link Generator
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage secure delivery links for your books
              </p>
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Link className="w-4 h-4" />
              <span>Generate New Link</span>
            </button>
          </div>
        </div>

        {/* Delivery Links List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Delivery Links
            </h2>
            <p className="text-gray-600">
              Manage your book delivery links and track their performance
            </p>
          </div>
          <div className="p-6">
            {deliveryLinks.length === 0 ? (
              <div className="text-center py-12">
                <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No delivery links created yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first delivery link to share your books securely
                </p>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Delivery Link
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {deliveryLinks.map((link) => (
                  <div
                    key={link.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {link.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              link.isActive,
                              link.expiryDate
                            )}`}
                          >
                            {getStatusText(link.isActive, link.expiryDate)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessTypeColor(
                              link.accessType
                            )}`}
                          >
                            {getAccessTypeIcon(link.accessType)}
                            <span className="ml-1">
                              {getAccessTypeText(link.accessType)}
                            </span>
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{link.description}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          Book: {link.bookTitle}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{link.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>
                              {link.currentDownloads}
                              {link.maxDownloads &&
                                `/${link.maxDownloads}`}{" "}
                              downloads
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              {getConversionRate(link.views, link.conversions)}{" "}
                              conversion rate
                            </span>
                          </div>
                          {link.expiryDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Expires {formatDate(link.expiryDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyUrl(link.shortUrl)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Copy Short URL"
                        >
                          {copiedUrl === link.shortUrl ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => window.open(link.url, "_blank")}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="View Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditLink(link)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleLinkStatus(link.id)}
                          className={`px-3 py-1 text-sm rounded ${
                            link.isActive
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {link.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            Short URL:
                          </p>
                          <p className="font-mono text-sm text-blue-600">
                            {link.shortUrl}
                          </p>
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Full URL:
                          </p>
                          <p className="font-mono text-sm text-gray-800 truncate">
                            {link.url}
                          </p>
                        </div>
                      </div>
                      {link.password && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            Password:
                          </p>
                          <p className="font-mono text-sm text-orange-600">
                            {link.password}
                          </p>
                        </div>
                      )}
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
            Delivery Link Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Access Control</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Email capture for lead generation</li>
                <li>Password protection for exclusive content</li>
                <li>Anonymous access for public sharing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Usage Limits</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Set maximum download limits</li>
                <li>Configure expiration dates</li>
                <li>Track usage and analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Analytics</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>View and download tracking</li>
                <li>Conversion rate monitoring</li>
                <li>Access time and location data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
