"use client";

import React, { useState } from "react";
import { ArrowLeft, HelpCircle, Eye } from "lucide-react";
import LandingPageSettings from "./LandingPageSettings";

interface DownloadPageFormProps {
  bookId: string;
  onBack: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const DownloadPageForm: React.FC<DownloadPageFormProps> = ({
  bookId,
  onBack,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    pageName: "",
    expirationDate: "",
    downloadLimit: "",
  });

  const [showLandingPageSettings, setShowLandingPageSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      type: "simple_download",
      bookId,
      downloadPage: {
        ...formData,
        landingPageSettings: {
          pageLayout: "WordToWallet Default",
          include3DEffects: true,
          pageTheme: "WordToWallet Black & Gray",
          accentColor: "Default",
          pageTitle: "Get your FREE copy of {{title}}.",
          buttonText: "Get My Book",
          heading1: {
            type: "tagline",
          },
          heading2: {
            type: "get_free_copy",
          },
          popupMessage: {
            type: "default",
          },
          pageText: {
            type: "book_description",
          },
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 ">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Pages</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Download Page
        </h1>
        <div className="text-sm text-gray-600">
          <span>Landing Pages / Download Pages / Add New Download Page</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-gray-700 mb-3">
          Add an expiration date or download limit, or personalize the page
          styling below.
        </p>
        <a
          href="#"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          What else can I do here?
        </a>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Page Details */}
        <div className="space-y-6">
          {/* Page Details */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Page Details
                </h2>
                <button
                  onClick={() =>
                    setShowLandingPageSettings(!showLandingPageSettings)
                  }
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showLandingPageSettings ? "−" : "+"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Download Page Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Download Page Name
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={formData.pageName}
                    onChange={(e) =>
                      handleInputChange("pageName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter page name"
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      handleInputChange("expirationDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - Download Limit */}
        <div className="bg-white rounded-lg shadow-sm border gap-6 p-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Download Limit
            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
          </label>
          <input
            type="number"
            value={formData.downloadLimit}
            onChange={(e) => handleInputChange("downloadLimit", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Enter download limit"
          />
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Word2Wallet updates download counts every
              1-2 minutes, so it is possible for a book to be downloaded past
              its limit if a large group of readers download very quickly.
            </p>
          </div>
        </div>
      </div>
      {/* Settings */}
      <div className="space-y-6">
        {/* Landing Page Settings */}
        <LandingPageSettings
          isExpanded={showLandingPageSettings}
          onToggle={() => setShowLandingPageSettings(!showLandingPageSettings)}
        />

        {/* Advanced Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Advanced Settings
              </h3>
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showAdvancedSettings ? "−" : "+"}
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Configure advanced options for your download page.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition-colors"
        >
          Save Download Page
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
        >
          Save and Close
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DownloadPageForm;
