"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Mail,
  Users,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  Calendar,
  ExternalLink,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  emailCaptureApi,
  EmailCapture as BackendEmailCapture,
  EmailCaptureStatus,
} from "@/services/emailCaptureApi";

// Frontend display interface
interface EmailCapture {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
  sourceType: "landing_page" | "delivery_link" | "manual";
  sourceId?: string;
  sourceTitle?: string;
  status: "new" | "contacted" | "converted" | "bounced";
  tags: string[];
  notes?: string;
  subscribedToNewsletter: boolean;
  createdAt: string;
  lastActivity?: string;
  country?: string;
  device?: string;
}

export default function EmailCapturesPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [emailCaptures, setEmailCaptures] = useState<EmailCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedCaptures, setSelectedCaptures] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingCapture, setEditingCapture] = useState<EmailCapture | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);

  // Transform backend data to frontend format
  const transformEmailCapture = (
    backendCapture: BackendEmailCapture
  ): EmailCapture => {
    // Determine source type based on IDs
    let sourceType: "landing_page" | "delivery_link" | "manual" = "manual";
    let sourceTitle = "";
    let sourceId = "";

    // Handle populated fields
    const bookData =
      typeof backendCapture.bookId === "object"
        ? backendCapture.bookId
        : undefined;
    const landingPageData =
      typeof backendCapture.landingPageId === "object"
        ? backendCapture.landingPageId
        : undefined;
    const deliveryLinkData =
      typeof backendCapture.deliveryLinkId === "object"
        ? backendCapture.deliveryLinkId
        : undefined;

    if (backendCapture.landingPageId) {
      sourceType = "landing_page";
      sourceId =
        landingPageData?._id || (backendCapture.landingPageId as string);
      sourceTitle = landingPageData?.title || bookData?.title || "Landing Page";
    } else if (backendCapture.deliveryLinkId) {
      sourceType = "delivery_link";
      sourceId =
        deliveryLinkData?._id || (backendCapture.deliveryLinkId as string);
      sourceTitle =
        deliveryLinkData?.title || bookData?.title || "Delivery Link";
    } else {
      sourceTitle = "Manual Import";
    }

    // Get device from user agent
    const device = backendCapture.metadata?.userAgent
      ? backendCapture.metadata.userAgent.includes("Mobile")
        ? "Mobile"
        : backendCapture.metadata.userAgent.includes("Tablet")
        ? "Tablet"
        : "Desktop"
      : undefined;

    return {
      id: backendCapture._id,
      email: backendCapture.email,
      firstName: backendCapture.firstName,
      lastName: backendCapture.lastName,
      source: backendCapture.source,
      sourceType,
      sourceId,
      sourceTitle,
      status: backendCapture.status,
      tags: backendCapture.tags || [],
      notes: backendCapture.notes,
      subscribedToNewsletter: backendCapture.subscribedToNewsletter,
      createdAt: backendCapture.createdAt,
      lastActivity: backendCapture.updatedAt,
      country: backendCapture.metadata?.country,
      device,
    };
  };

  const fetchEmailCaptures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await emailCaptureApi.getEmailCaptures({
        page: 1,
        limit: 1000, // Get all for now
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const transformedCaptures = response.emailCaptures.map(
        transformEmailCapture
      );
      setEmailCaptures(transformedCaptures);
    } catch (error) {
      console.error("Failed to fetch email captures:", error);
      setEmailCaptures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchEmailCaptures();
  }, [isLoggedIn, navigate, fetchEmailCaptures]);

  const handleSelectCapture = (captureId: string) => {
    setSelectedCaptures((prev) =>
      prev.includes(captureId)
        ? prev.filter((id) => id !== captureId)
        : [...prev, captureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCaptures.length === filteredCaptures.length) {
      setSelectedCaptures([]);
    } else {
      setSelectedCaptures(filteredCaptures.map((capture) => capture.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCaptures.length === 0) return;

    try {
      if (action === "delete") {
        // Delete selected captures
        await Promise.all(
          selectedCaptures.map((id) => emailCaptureApi.deleteEmailCapture(id))
        );
        // Refresh list
        await fetchEmailCaptures();
      } else if (action === "tag") {
        // Handle tagging - could open a modal for tag selection
        const tags = prompt("Enter tags (comma-separated):");
        if (tags) {
          const tagArray = tags.split(",").map((t) => t.trim());
          await emailCaptureApi.addTagsToEmailCaptures(
            selectedCaptures,
            tagArray
          );
          await fetchEmailCaptures();
        }
      } else if (action === "export") {
        // Export selected captures
        console.log("Export selected captures - implement download logic");
      }

      setSelectedCaptures([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
      alert(`Failed to ${action} email captures. Please try again.`);
    }
  };

  const handleEditCapture = (capture: EmailCapture) => {
    setEditingCapture(capture);
    setShowEditModal(true);
  };

  const handleUpdateCapture = async (updatedCapture: EmailCapture) => {
    try {
      await emailCaptureApi.updateEmailCapture(updatedCapture.id, {
        firstName: updatedCapture.firstName,
        lastName: updatedCapture.lastName,
        status: updatedCapture.status as EmailCaptureStatus,
        tags: updatedCapture.tags,
        notes: updatedCapture.notes,
      });
      await fetchEmailCaptures();
      setShowEditModal(false);
      setEditingCapture(null);
    } catch (error) {
      console.error("Failed to update email capture:", error);
      alert("Failed to update email capture. Please try again.");
    }
  };

  const handleDeleteCapture = async (captureId: string) => {
    if (window.confirm("Are you sure you want to delete this email capture?")) {
      try {
        await emailCaptureApi.deleteEmailCapture(captureId);
        await fetchEmailCaptures();
      } catch (error) {
        console.error("Failed to delete email capture:", error);
        alert("Failed to delete email capture. Please try again.");
      }
    }
  };

  const handleExportAll = async () => {
    try {
      // Export as CSV
      const blob = (await emailCaptureApi.exportEmailCaptures({
        format: "csv",
      })) as Blob;

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `email-captures-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export email captures:", error);
      alert("Failed to export email captures. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-blue-600 bg-blue-50";
      case "contacted":
        return "text-purple-600 bg-purple-50";
      case "converted":
        return "text-green-600 bg-green-50";
      case "bounced":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Mail className="w-4 h-4" />;
      case "contacted":
        return <Mail className="w-4 h-4" />;
      case "converted":
        return <CheckCircle className="w-4 h-4" />;
      case "bounced":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType) {
      case "landing_page":
        return "text-blue-600 bg-blue-50";
      case "delivery_link":
        return "text-green-600 bg-green-50";
      case "manual":
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredCaptures = emailCaptures.filter((capture) => {
    const matchesSearch =
      capture.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capture.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capture.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capture.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || capture.status === statusFilter;
    const matchesSource =
      sourceFilter === "all" || capture.sourceType === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  if (loading) {
    return (
      <div className="min-h-screen ">
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
                Email Captures
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and export captured reader emails
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportAll}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
              {/* <button
                onClick={() => navigate("/integrations")}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Email Marketing</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Captures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {emailCaptures.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emailCaptures.filter((c) => c.status === "contacted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emailCaptures.filter((c) => c.status === "converted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounced</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emailCaptures.filter((c) => c.status === "bounced").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email, name, or source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="bounced">Bounced</option>
                </select>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sources</option>
                  <option value="landing_page">Landing Pages</option>
                  <option value="delivery_link">Delivery Links</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCaptures.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedCaptures.length} capture
                {selectedCaptures.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction("tag")}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Tags
                </button>
                <button
                  onClick={() => handleBulkAction("export")}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedCaptures([])}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Captures List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Email Captures ({filteredCaptures.length})
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    selectedCaptures.length === filteredCaptures.length &&
                    filteredCaptures.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {filteredCaptures.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No email captures found
                </h3>
                <p className="text-gray-600">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  sourceFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start capturing emails from your landing pages and delivery links"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCaptures.map((capture) => (
                  <div
                    key={capture.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCaptures.includes(capture.id)}
                        onChange={() => handleSelectCapture(capture.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                          <h3 className="font-medium text-gray-900">
                            {capture.firstName && capture.lastName
                              ? `${capture.firstName} ${capture.lastName}`
                              : capture.email}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
                              capture.status
                            )}`}
                          >
                            {getStatusIcon(capture.status)}
                            <span>{capture.status}</span>
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceTypeColor(
                              capture.sourceType
                            )}`}
                          >
                            {capture.sourceType.replace("_", " ")}
                          </span>
                          {capture.subscribedToNewsletter && (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 text-indigo-600 bg-indigo-50"
                              title="Subscribed to newsletter"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Newsletter</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {capture.email}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Source: {capture.source}</span>
                          <span>•</span>
                          <span>Captured: {formatDate(capture.createdAt)}</span>
                          {capture.country && (
                            <>
                              <span>•</span>
                              <span>{capture.country}</span>
                            </>
                          )}
                          {capture.device && (
                            <>
                              <span>•</span>
                              <span>{capture.device}</span>
                            </>
                          )}
                        </div>
                        {capture.tags.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <div className="flex space-x-1">
                              {capture.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {capture.notes && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            {capture.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCapture(capture)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCapture(capture.id)}
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
            Email Capture Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Capture Sources</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Landing pages with email forms</li>
                <li>Delivery links requiring email access</li>
                <li>Manual imports and additions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Management Features</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Tag and categorize captures</li>
                <li>Export to CSV or email marketing platforms</li>
                <li>Track engagement and status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
