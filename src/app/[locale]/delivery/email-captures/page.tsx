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

interface EmailCapture {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
  sourceType: "landing_page" | "delivery_link" | "manual";
  sourceId?: string;
  sourceTitle?: string;
  status: "active" | "unsubscribed" | "bounced";
  tags: string[];
  notes?: string;
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchEmailCaptures();
  }, [isLoggedIn, navigate]);

  const fetchEmailCaptures = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setEmailCaptures([
        {
          id: "1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          source: "Digital Marketing Mastery Landing Page",
          sourceType: "landing_page",
          sourceId: "1",
          sourceTitle: "Digital Marketing Mastery",
          status: "active",
          tags: ["marketing", "premium"],
          notes: "Interested in advanced marketing strategies",
          createdAt: "2024-01-15T10:30:00Z",
          lastActivity: "2024-01-16T14:20:00Z",
          country: "United States",
          device: "Desktop",
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          source: "SEO Techniques Delivery Link",
          sourceType: "delivery_link",
          sourceId: "2",
          sourceTitle: "SEO Techniques - Public Access",
          status: "active",
          tags: ["seo", "free"],
          createdAt: "2024-01-14T15:45:00Z",
          lastActivity: "2024-01-16T09:15:00Z",
          country: "United Kingdom",
          device: "Mobile",
        },
        {
          id: "3",
          email: "mike.wilson@example.com",
          firstName: "Mike",
          lastName: "Wilson",
          source: "Content Marketing Playbook Landing Page",
          sourceType: "landing_page",
          sourceId: "3",
          sourceTitle: "Content Marketing Playbook",
          status: "active",
          tags: ["content", "marketing"],
          notes: "Content creator looking for growth strategies",
          createdAt: "2024-01-12T11:20:00Z",
          lastActivity: "2024-01-15T16:30:00Z",
          country: "Canada",
          device: "Tablet",
        },
        {
          id: "4",
          email: "sarah.jones@example.com",
          firstName: "Sarah",
          lastName: "Jones",
          source: "Manual Import",
          sourceType: "manual",
          status: "unsubscribed",
          tags: ["imported"],
          createdAt: "2024-01-10T09:00:00Z",
          lastActivity: "2024-01-12T10:15:00Z",
          country: "Australia",
          device: "Desktop",
        },
        {
          id: "5",
          email: "bob.brown@example.com",
          firstName: "Bob",
          lastName: "Brown",
          source: "Social Media Strategy Delivery Link",
          sourceType: "delivery_link",
          sourceId: "4",
          sourceTitle: "Social Media Strategy - Expired",
          status: "bounced",
          tags: ["social", "expired"],
          createdAt: "2024-01-08T14:30:00Z",
          lastActivity: "2024-01-09T11:45:00Z",
          country: "Germany",
          device: "Mobile",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch email captures:", error);
    } finally {
      setLoading(false);
    }
  };

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
      // API call for bulk action
      console.log(`Bulk ${action} for captures:`, selectedCaptures);

      // Update local state based on action
      if (action === "delete") {
        setEmailCaptures(
          emailCaptures.filter(
            (capture) => !selectedCaptures.includes(capture.id)
          )
        );
      } else if (action === "tag") {
        // Handle tagging
        console.log("Add tags to selected captures");
      } else if (action === "export") {
        // Handle export
        console.log("Export selected captures");
      }

      setSelectedCaptures([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
    }
  };

  const handleEditCapture = (capture: EmailCapture) => {
    setEditingCapture(capture);
    setShowEditModal(true);
  };

  const handleUpdateCapture = async (updatedCapture: EmailCapture) => {
    try {
      // API call to update capture
      setEmailCaptures(
        emailCaptures.map((capture) =>
          capture.id === updatedCapture.id ? updatedCapture : capture
        )
      );
      setShowEditModal(false);
      setEditingCapture(null);
    } catch (error) {
      console.error("Failed to update email capture:", error);
    }
  };

  const handleDeleteCapture = async (captureId: string) => {
    if (window.confirm("Are you sure you want to delete this email capture?")) {
      try {
        // API call to delete capture
        setEmailCaptures(
          emailCaptures.filter((capture) => capture.id !== captureId)
        );
      } catch (error) {
        console.error("Failed to delete email capture:", error);
      }
    }
  };

  const handleExportAll = () => {
    // Implement export functionality
    console.log("Exporting all email captures...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "unsubscribed":
        return "text-yellow-600 bg-yellow-50";
      case "bounced":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "unsubscribed":
        return <XCircle className="w-4 h-4" />;
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
              <button
                onClick={() => navigate("/integrations")}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Email Marketing</span>
              </button>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emailCaptures.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Unsubscribed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    emailCaptures.filter((c) => c.status === "unsubscribed")
                      .length
                  }
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
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
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
                        <div className="flex items-center space-x-3 mb-2">
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
