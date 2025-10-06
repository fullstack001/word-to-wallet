"use client";

import React, { useState } from "react";
import { ArrowLeft, HelpCircle, RefreshCw, Eye } from "lucide-react";
import LandingPageSettings from "./LandingPageSettings";

interface RestrictedPageFormProps {
  bookId: string;
  onBack: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const RestrictedPageForm: React.FC<RestrictedPageFormProps> = ({
  bookId,
  onBack,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    pageName: "",
    expirationDate: "",
    downloadLimit: "",
    restrictedList: "",
    redirectUrl: "",
    confirmEmail: true,
  });

  const [showLandingPageSettings, setShowLandingPageSettings] = useState(false);
  const [showDeliveryPageSettings, setShowDeliveryPageSettings] =
    useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      type: "restricted",
      bookId,
      restrictedPage: {
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
          Add New Restricted Page
        </h1>
        <div className="text-sm text-gray-600">
          <span>
            Landing Pages / Restricted Pages / Add New Restricted Page
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-gray-700 mb-3">
          Restrict this page to a specific list or any active subscriber.
        </p>
        <p className="text-red-600 font-medium">
          Avoid this common mistake when using restricted pages.
        </p>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Main Settings */}
        <div className="space-y-6">
          {/* Restricted Page Settings */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Restricted Page Settings
                </h2>
                <button
                  onClick={() =>
                    setShowLandingPageSettings(!showLandingPageSettings)
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showLandingPageSettings ? "−" : "+"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Restricted Page Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restricted Page Name
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

                {/* Restricted List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restricted List
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
                    >
                      Refresh
                    </a>
                  </label>
                  <select
                    value={formData.restrictedList}
                    onChange={(e) =>
                      handleInputChange("restrictedList", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Choose a List</option>
                    <option value="mailchimp_main">Mailchimp Main List</option>
                    <option value="convertkit_subscribers">
                      ConvertKit Subscribers
                    </option>
                    <option value="mailerlite_reviewers">
                      MailerLite Reviewers
                    </option>
                  </select>
                </div>

                {/* Redirect URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where should we redirect non-subscribers?
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="url"
                    value={formData.redirectUrl}
                    onChange={(e) =>
                      handleInputChange("redirectUrl", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Redirect URL for non-subscribers"
                  />
                </div>

                {/* Confirm Email */}
                <div>
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.confirmEmail}
                      onChange={(e) =>
                        handleInputChange("confirmEmail", e.target.checked)
                      }
                      className="mr-3"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Confirm the reader's address by email
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Settings */}
        <div className="space-y-6">
          {/* Limits & Dates */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Limits & Dates
              </h3>
              <div className="space-y-4">
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

                {/* Download Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Download Limit
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="number"
                    value={formData.downloadLimit}
                    onChange={(e) =>
                      handleInputChange("downloadLimit", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter download limit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Landing Page Settings */}
      <LandingPageSettings
        isExpanded={showLandingPageSettings}
        onToggle={() => setShowLandingPageSettings(!showLandingPageSettings)}
      />

      {/* Delivery Page Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Delivery Page Settings
            </h3>
            <button
              onClick={() =>
                setShowDeliveryPageSettings(!showDeliveryPageSettings)
              }
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showDeliveryPageSettings ? "−" : "+"}
            </button>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Open the Delivery Page Settings to customize the reader's download
            page.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Delivery Page Settings
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
          </div>
        </div>
      </div>

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
            Configure advanced options for your restricted page.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition-colors"
        >
          Save Restricted Page
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

export default RestrictedPageForm;
