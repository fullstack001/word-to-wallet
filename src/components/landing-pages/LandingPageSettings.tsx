"use client";

import React, { useState } from "react";
import { HelpCircle, Eye } from "lucide-react";

interface LandingPageSettingsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

interface LandingPageSettingsData {
  pageLayout: string;
  include3DEffects: boolean;
  pageTheme: string;
  accentColor: string;
  pageTitle: string;
  buttonText: string;
  heading1: string;
  heading1Custom: string;
  heading2: string;
  heading2Custom: string;
  popupMessage: string;
  popupMessageCustom: string;
  pageText: string;
  pageTextCustom: string;
}

const LandingPageSettings: React.FC<LandingPageSettingsProps> = ({
  isExpanded,
  onToggle,
}) => {
  const [settings, setSettings] = useState<LandingPageSettingsData>({
    pageLayout: "WordToWallet Default",
    include3DEffects: true,
    pageTheme: "WordToWallet Black & Gray",
    accentColor: "Default",
    pageTitle: "Get your FREE copy of {{title}}.",
    buttonText: "Get My Book",
    heading1: "tagline",
    heading1Custom: "",
    heading2: "get_free_copy",
    heading2Custom: "",
    popupMessage: "default",
    popupMessageCustom: "",
    pageText: "book_description",
    pageTextCustom: "",
  });

  const handleSettingChange = (
    field: keyof LandingPageSettingsData,
    value: any
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Landing Page Settings
            </h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            The landing page is the first page the reader sees. Use it to grab
            their attention and convince them they want your free download.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Landing Page Settings
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
              <Eye className="w-4 h-4 mr-1" />
              Preview EU
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Landing Page Settings
          </h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            −
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          The landing page is the first page the reader sees. Use it to grab
          their attention and convince them they want your free download.
        </p>

        {/* Grid Layout for Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Page Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Layout
              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
            </label>
            <select
              value={settings.pageLayout}
              onChange={(e) =>
                handleSettingChange("pageLayout", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="WordToWallet Default">WordToWallet Default</option>
              <option value="Custom Layout">Custom Layout</option>
              <option value="Minimal">Minimal</option>
            </select>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.include3DEffects}
                  onChange={(e) =>
                    handleSettingChange("include3DEffects", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  Include 3D effects on book cover
                </span>
              </label>
            </div>
          </div>

          {/* Page Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Theme
              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
            </label>
            <select
              value={settings.pageTheme}
              onChange={(e) => handleSettingChange("pageTheme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="WordToWallet Black & Gray">
                WordToWallet Black & Gray
              </option>
              <option value="Light Theme">Light Theme</option>
              <option value="Dark Theme">Dark Theme</option>
              <option value="Custom Theme">Custom Theme</option>
            </select>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
            </label>
            <select
              value={settings.accentColor}
              onChange={(e) =>
                handleSettingChange("accentColor", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="Default">Default</option>
              <option value="Orange">Orange</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Purple">Purple</option>
            </select>
          </div>

          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
            </label>
            <input
              type="text"
              value={settings.pageTitle}
              onChange={(e) => handleSettingChange("pageTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Get your FREE copy of {{title}}."
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
            </label>
            <input
              type="text"
              value={settings.buttonText}
              onChange={(e) =>
                handleSettingChange("buttonText", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Get My Book"
            />
          </div>
        </div>

        {/* Two Column Layout for Complex Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column - Headings */}
          <div className="space-y-6">
            {/* Heading 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Heading 1
                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading1"
                    value="none"
                    checked={settings.heading1 === "none"}
                    onChange={(e) =>
                      handleSettingChange("heading1", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Do not show a heading
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading1"
                    value="tagline"
                    checked={settings.heading1 === "tagline"}
                    onChange={(e) =>
                      handleSettingChange("heading1", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use the book's tagline
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading1"
                    value="newsletter"
                    checked={settings.heading1 === "newsletter"}
                    onChange={(e) =>
                      handleSettingChange("heading1", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Join my newsletter...
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading1"
                    value="get_free_copy"
                    checked={settings.heading1 === "get_free_copy"}
                    onChange={(e) =>
                      handleSettingChange("heading1", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Get your FREE copy of ...
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading1"
                    value="custom"
                    checked={settings.heading1 === "custom"}
                    onChange={(e) =>
                      handleSettingChange("heading1", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use a custom heading
                    </span>
                  </div>
                </label>
                {settings.heading1 === "custom" && (
                  <input
                    type="text"
                    value={settings.heading1Custom}
                    onChange={(e) =>
                      handleSettingChange("heading1Custom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter custom heading"
                  />
                )}
              </div>
            </div>

            {/* Heading 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Heading 2
                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading2"
                    value="none"
                    checked={settings.heading2 === "none"}
                    onChange={(e) =>
                      handleSettingChange("heading2", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Do not show a heading
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading2"
                    value="tagline"
                    checked={settings.heading2 === "tagline"}
                    onChange={(e) =>
                      handleSettingChange("heading2", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use the book's tagline
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading2"
                    value="subscribers"
                    checked={settings.heading2 === "subscribers"}
                    onChange={(e) =>
                      handleSettingChange("heading2", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Subscribers get...
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading2"
                    value="get_free_copy"
                    checked={settings.heading2 === "get_free_copy"}
                    onChange={(e) =>
                      handleSettingChange("heading2", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Get your FREE copy of ...
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heading2"
                    value="custom"
                    checked={settings.heading2 === "custom"}
                    onChange={(e) =>
                      handleSettingChange("heading2", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use a custom heading
                    </span>
                  </div>
                </label>
                {settings.heading2 === "custom" && (
                  <input
                    type="text"
                    value={settings.heading2Custom}
                    onChange={(e) =>
                      handleSettingChange("heading2Custom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter custom heading"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Messages and Text */}
          <div className="space-y-6">
            {/* Pop Up Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pop Up Message
                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="popupMessage"
                    value="none"
                    checked={settings.popupMessage === "none"}
                    onChange={(e) =>
                      handleSettingChange("popupMessage", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Do not show any message in the pop up
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="popupMessage"
                    value="default"
                    checked={settings.popupMessage === "default"}
                    onChange={(e) =>
                      handleSettingChange("popupMessage", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use WordToWallet default message
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="popupMessage"
                    value="custom"
                    checked={settings.popupMessage === "custom"}
                    onChange={(e) =>
                      handleSettingChange("popupMessage", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use custom pop up message
                    </span>
                  </div>
                </label>
                {settings.popupMessage === "custom" && (
                  <textarea
                    value={settings.popupMessageCustom}
                    onChange={(e) =>
                      handleSettingChange("popupMessageCustom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter custom popup message"
                    rows={3}
                  />
                )}
              </div>
            </div>

            {/* Page Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Page Text
                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="pageText"
                    value="none"
                    checked={settings.pageText === "none"}
                    onChange={(e) =>
                      handleSettingChange("pageText", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Do not show any page text
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="pageText"
                    value="book_description"
                    checked={settings.pageText === "book_description"}
                    onChange={(e) =>
                      handleSettingChange("pageText", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use the book description on the page
                    </span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="pageText"
                    value="custom"
                    checked={settings.pageText === "custom"}
                    onChange={(e) =>
                      handleSettingChange("pageText", e.target.value)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Use custom text or description on the page
                    </span>
                  </div>
                </label>
                {settings.pageText === "custom" && (
                  <textarea
                    value={settings.pageTextCustom}
                    onChange={(e) =>
                      handleSettingChange("pageTextCustom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter custom page text"
                    rows={4}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            Landing Page Settings
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview EU
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageSettings;
