"use client";

import React, { useState } from "react";
import { ArrowLeft, HelpCircle, RefreshCw } from "lucide-react";
import LandingPageSettings from "./LandingPageSettings";

interface EmailSignupPageFormProps {
  bookId: string;
  onBack: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const EmailSignupPageForm: React.FC<EmailSignupPageFormProps> = ({
  bookId,
  onBack,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    pageName: "",
    mailingListAction: "required", // required, optional, none
    integrationList: "no_list",
    expirationDate: "",
    claimLimit: "",
    askFirstName: true,
    askLastName: false,
    confirmEmail: true,
  });

  const [showLandingPageSettings, setShowLandingPageSettings] = useState(false);
  const [showThankYouPageSettings, setShowThankYouPageSettings] =
    useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      type: "email_signup",
      bookId,
      emailSignupPage: {
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
    <div className=" mx-auto px-4">
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
          Add New Signup Page
        </h1>
        <div className="text-sm text-gray-600">
          <span>Landing Pages / Signup Pages / Add New Signup Page</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-700 mb-3">
          Select your opt-in settings and optionally add an expiration date or
          download limit below.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <p className="text-gray-700">
            Want emails to be added to your mailing list automatically?{" "}
            <a
              href="#"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Integrate your account today!
            </a>
          </p>
          <a
            href="#"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            What else can I do here?
          </a>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Main Settings */}
        <div className="space-y-6">
          {/* Opt-In Settings */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Opt-In Settings
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
                {/* Opt-In Page Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opt-In Page Name
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

                {/* Mailing List Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mailing List Action
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="mailingListAction"
                        value="none"
                        checked={formData.mailingListAction === "none"}
                        onChange={(e) =>
                          handleInputChange("mailingListAction", e.target.value)
                        }
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          No Mailing List
                        </span>
                        <span className="text-xs text-gray-600">
                          Reader is not signing up for a list
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="mailingListAction"
                        value="optional"
                        checked={formData.mailingListAction === "optional"}
                        onChange={(e) =>
                          handleInputChange("mailingListAction", e.target.value)
                        }
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          Optional Opt-In
                        </span>
                        <span className="text-xs text-gray-600">
                          Reader can choose to sign up for a list
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="mailingListAction"
                        value="required"
                        checked={formData.mailingListAction === "required"}
                        onChange={(e) =>
                          handleInputChange("mailingListAction", e.target.value)
                        }
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          Required Opt-In
                        </span>
                        <span className="text-xs text-gray-600">
                          Reader must sign up for a list to get the book
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Integration List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration List
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
                    >
                      Refresh
                    </a>
                  </label>
                  <select
                    value={formData.integrationList}
                    onChange={(e) =>
                      handleInputChange("integrationList", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="no_list">No list, export CSV only</option>
                    <option value="mailchimp">Mailchimp List</option>
                    <option value="convertkit">ConvertKit List</option>
                    <option value="mailerlite">MailerLite List</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Signup Options
            </h3>
            <div className="space-y-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.askFirstName}
                  onChange={(e) =>
                    handleInputChange("askFirstName", e.target.checked)
                  }
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-900">
                  Ask the reader for their first name
                </span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.askLastName}
                  onChange={(e) =>
                    handleInputChange("askLastName", e.target.checked)
                  }
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-900">
                  Also ask the reader for their last name
                </span>
              </label>
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
                  Confirm the reader's email address before receiving their book
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </span>
              </label>
            </div>
          </div>
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

                {/* Claim Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Limit
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="number"
                    value={formData.claimLimit}
                    onChange={(e) =>
                      handleInputChange("claimLimit", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter claim limit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  Additional Settings */}
      <div className="space-y-6">
        {/* Landing Page Settings */}
        <LandingPageSettings
          isExpanded={showLandingPageSettings}
          onToggle={() => setShowLandingPageSettings(!showLandingPageSettings)}
        />

        {/* Thank You Page Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thank You Page Settings
              </h3>
              <button
                onClick={() =>
                  setShowThankYouPageSettings(!showThankYouPageSettings)
                }
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showThankYouPageSettings ? "−" : "+"}
              </button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Open the Thank You Page Settings to customize the reader's
              download page after signup.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Thank You Page Settings
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                Preview
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                Preview EU
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
              Configure advanced options for your signup page.
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

export default EmailSignupPageForm;
