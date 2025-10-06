"use client";

import React, { useState, useEffect } from "react";
import {
  Link,
  Copy,
  Settings,
  Calendar,
  Lock,
  Mail,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

interface LinkGeneratorProps {
  bookId: string;
  onLinkCreated?: (link: any) => void;
  initialData?: any;
  onClose?: () => void;
}

interface LinkSettings {
  requireEmail: boolean;
  allowAnonymous: boolean;
  maxDownloads?: number;
  expiryDate?: string;
  password?: string;
}

interface DeliveryLink {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  url: string;
  isActive: boolean;
  settings: LinkSettings;
  analytics: {
    totalViews: number;
    totalDownloads: number;
    uniqueVisitors: number;
    emailCaptures: number;
    lastAccessed?: string;
  };
  createdAt: string;
}

const LinkGenerator: React.FC<LinkGeneratorProps> = ({
  bookId,
  onLinkCreated,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [settings, setSettings] = useState<LinkSettings>({
    requireEmail: false,
    allowAnonymous: true,
    maxDownloads: undefined,
    expiryDate: undefined,
    password: undefined,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<DeliveryLink | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setSettings(initialData.settings || settings);
    }
  }, [initialData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGenerateLink = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the delivery link");
      return;
    }

    setIsGenerating(true);
    try {
      const linkData = {
        bookId,
        title: title.trim(),
        description: description.trim(),
        settings: {
          ...settings,
          expiryDate: settings.expiryDate
            ? new Date(settings.expiryDate).toISOString()
            : undefined,
        },
      };

      const response = await fetch("/api/delivery-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedLink(result.data);
        if (onLinkCreated) {
          onLinkCreated(result.data);
        }
      } else {
        const error = await response.json();
        alert(`Error creating link: ${error.message}`);
      }
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Failed to generate delivery link");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getStatusColor = (link: DeliveryLink) => {
    if (!link.isActive) return "text-red-600";
    if (isExpired(link.settings.expiryDate)) return "text-orange-600";
    return "text-green-600";
  };

  const getStatusText = (link: DeliveryLink) => {
    if (!link.isActive) return "Inactive";
    if (isExpired(link.settings.expiryDate)) return "Expired";
    return "Active";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Generate Delivery Link
        </h1>
        <p className="text-gray-600">
          Create a unique link to share your book with readers
        </p>
      </div>

      {!generatedLink ? (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Free Download - My Book"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used to generate the URL slug:{" "}
                  {generateSlug(title) || "your-link-slug"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional description for this delivery link"
                />
              </div>
            </div>
          </div>

          {/* Access Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Access Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Require Email Address
                    </label>
                    <p className="text-xs text-gray-500">
                      Readers must provide their email to download
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        requireEmail: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Allow Anonymous Access
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow downloads without email capture
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowAnonymous}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowAnonymous: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Password Protection
                    </label>
                    <p className="text-xs text-gray-500">
                      Require a password to access the link
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={settings.password || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Limits & Expiry */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Limits & Expiry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Downloads
                </label>
                <input
                  type="number"
                  value={settings.maxDownloads || ""}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxDownloads: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="No limit"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for unlimited downloads
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={settings.expiryDate || ""}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for no expiry
                </p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerateLink}
              disabled={isGenerating || !title.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link className="w-4 h-4" />
              <span>{isGenerating ? "Generating..." : "Generate Link"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Delivery Link Created Successfully!
              </h3>
            </div>
            <p className="text-green-700 mt-1">
              Your delivery link is ready to share with readers.
            </p>
          </div>

          {/* Link Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Link Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Title
                </label>
                <p className="text-gray-900">{generatedLink.title}</p>
              </div>

              {generatedLink.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{generatedLink.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedLink.url)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <a
                    href={generatedLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      generatedLink
                    )}`}
                  >
                    {getStatusText(generatedLink)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {formatDateTime(generatedLink.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Access Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Email Required:{" "}
                    {generatedLink.settings.requireEmail ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Anonymous Access:{" "}
                    {generatedLink.settings.allowAnonymous ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Password Protected:{" "}
                    {generatedLink.settings.password ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Max Downloads:{" "}
                    {generatedLink.settings.maxDownloads || "Unlimited"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Expires:{" "}
                    {generatedLink.settings.expiryDate
                      ? formatDate(generatedLink.settings.expiryDate)
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Preview */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {generatedLink.analytics.totalViews}
                </div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {generatedLink.analytics.totalDownloads}
                </div>
                <div className="text-sm text-gray-600">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {generatedLink.analytics.uniqueVisitors}
                </div>
                <div className="text-sm text-gray-600">Unique Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {generatedLink.analytics.emailCaptures}
                </div>
                <div className="text-sm text-gray-600">Email Captures</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setGeneratedLink(null);
                setTitle("");
                setDescription("");
                setSettings({
                  requireEmail: false,
                  allowAnonymous: true,
                  maxDownloads: undefined,
                  expiryDate: undefined,
                  password: undefined,
                });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Create Another Link
            </button>
            <button
              onClick={() => copyToClipboard(generatedLink.url)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkGenerator;
