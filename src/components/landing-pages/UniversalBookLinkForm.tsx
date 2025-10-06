"use client";

import React, { useState } from "react";
import { ArrowLeft, HelpCircle, Globe, Search } from "lucide-react";
import LandingPageSettings from "./LandingPageSettings";

interface UniversalBookLinkFormProps {
  bookId: string;
  onBack: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const UniversalBookLinkForm: React.FC<UniversalBookLinkFormProps> = ({
  bookId,
  onBack,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    linkName: "",
    expirationDate: "",
    selectedBook: bookId,
    audioSample: "no_audio",
    displayEbookLinks: true,
    displayAudiobookLinks: true,
    displayPaperbackLinks: true,
  });

  const [showLandingPageSettings, setShowLandingPageSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      type: "universal_link",
      bookId,
      universalBookLink: {
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
          Add New Universal Book Link
        </h1>
        <div className="text-sm text-gray-600">
          <span>
            Landing Pages / Universal Book Links / Add New Universal Book Link
          </span>
        </div>
      </div>

      {/* Help Section */}
      <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <p className="text-gray-700 mb-3">
          Have some questions about how to complete this form?
        </p>
        <a href="#" className="text-red-600 hover:text-red-700 font-medium">
          Learn more about sales pages in our author knowledge base.
        </a>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Link Details */}
        <div className="space-y-6">
          {/* Universal Book Link Details */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Universal Book Link Details
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
                {/* Link Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Name
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={formData.linkName}
                    onChange={(e) =>
                      handleInputChange("linkName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter link name"
                  />
                </div>

                {/* Book to Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book to Display
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <select
                    value={formData.selectedBook}
                    onChange={(e) =>
                      handleInputChange("selectedBook", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value={bookId}>ABM</option>
                    <option value="book2">Book 2</option>
                    <option value="book3">Book 3</option>
                  </select>
                </div>

                {/* Audio for Sample */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio for Sample
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <select
                    value={formData.audioSample}
                    onChange={(e) =>
                      handleInputChange("audioSample", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="no_audio">No audio sample</option>
                    <option value="sample1">Sample 1</option>
                    <option value="sample2">Sample 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Store Links */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Store Links
                </h3>
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
                <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Fetch from Books2Read
                </button>

                <div className="space-y-4">
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.displayEbookLinks}
                      onChange={(e) =>
                        handleInputChange("displayEbookLinks", e.target.checked)
                      }
                      className="mr-3"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Display ebook links on landing page
                    </span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.displayAudiobookLinks}
                      onChange={(e) =>
                        handleInputChange(
                          "displayAudiobookLinks",
                          e.target.checked
                        )
                      }
                      className="mr-3"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Display audiobook links on landing page
                    </span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.displayPaperbackLinks}
                      onChange={(e) =>
                        handleInputChange(
                          "displayPaperbackLinks",
                          e.target.checked
                        )
                      }
                      className="mr-3"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Display paperback links on landing page
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Expiration Date */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Expiration Settings
              </h3>
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

          {/* Landing Page Settings */}
          <LandingPageSettings
            isExpanded={showLandingPageSettings}
            onToggle={() =>
              setShowLandingPageSettings(!showLandingPageSettings)
            }
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
                Configure advanced options for your universal book link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition-colors"
        >
          Save Page
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

export default UniversalBookLinkForm;
