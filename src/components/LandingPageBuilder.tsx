"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Eye,
  Palette,
  Type,
  Image,
  Plus,
  Trash2,
  Move,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

interface LandingPageBuilderProps {
  bookId: string;
  onSave?: (landingPage: any) => void;
  onPreview?: (landingPage: any) => void;
  initialData?: any;
}

interface DesignSettings {
  theme: "default" | "minimal" | "modern" | "classic";
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  customCSS?: string;
}

interface ContentSettings {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: string;
  features: string[];
  testimonials: Array<{
    name: string;
    text: string;
    avatar?: string;
  }>;
  callToAction: {
    text: string;
    buttonText: string;
    buttonColor: string;
  };
  aboutAuthor?: {
    name: string;
    bio: string;
    avatar?: string;
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  ogImage?: string;
}

const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  bookId,
  onSave,
  onPreview,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<
    "content" | "design" | "seo" | "preview"
  >("content");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isSaving, setIsSaving] = useState(false);

  const [design, setDesign] = useState<DesignSettings>({
    theme: "default",
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    fontFamily: "Inter",
    customCSS: "",
  });

  const [content, setContent] = useState<ContentSettings>({
    heroTitle: "Get Your Free Book Today",
    heroSubtitle:
      "Download our latest book and join thousands of satisfied readers",
    heroImage: "",
    features: [
      "High-quality content",
      "Easy to read format",
      "Mobile-friendly",
    ],
    testimonials: [],
    callToAction: {
      text: "Ready to get started?",
      buttonText: "Download Now",
      buttonColor: "#3B82F6",
    },
    aboutAuthor: {
      name: "",
      bio: "",
      avatar: "",
      socialLinks: {
        twitter: "",
        facebook: "",
        instagram: "",
        website: "",
      },
    },
    faq: [],
  });

  const [seo, setSeo] = useState<SEOSettings>({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    ogImage: "",
  });

  useEffect(() => {
    if (initialData) {
      setDesign(initialData.design || design);
      setContent(initialData.content || content);
      setSeo(initialData.seo || seo);
    }
  }, [initialData]);

  const addFeature = () => {
    setContent((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setContent((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setContent((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", text: "", avatar: "" }],
    }));
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) =>
        i === index ? { ...testimonial, [field]: value } : testimonial
      ),
    }));
  };

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    setContent((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const updateFAQ = (index: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      faq: prev.faq.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const removeFAQ = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !seo.metaKeywords.includes(keyword.trim())) {
      setSeo((prev) => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, keyword.trim()],
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setSeo((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const landingPageData = {
        bookId,
        title: content.heroTitle,
        description: content.heroSubtitle,
        design,
        content,
        seo,
      };

      if (onSave) {
        await onSave(landingPageData);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, heroTitle: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  heroSubtitle: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter hero subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image URL
            </label>
            <input
              type="url"
              value={content.heroImage}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, heroImage: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <button
            onClick={addFeature}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature</span>
          </button>
        </div>
        <div className="space-y-3">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feature"
              />
              <button
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Call to Action</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={content.callToAction.text}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  callToAction: { ...prev.callToAction, text: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ready to get started?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={content.callToAction.buttonText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  callToAction: {
                    ...prev.callToAction,
                    buttonText: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Download Now"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <button
            onClick={addTestimonial}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
        <div className="space-y-4">
          {content.testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) =>
                    updateTestimonial(index, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer name"
                />
                <textarea
                  value={testimonial.text}
                  onChange={(e) =>
                    updateTestimonial(index, "text", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Testimonial text"
                />
                <input
                  type="url"
                  value={testimonial.avatar}
                  onChange={(e) =>
                    updateTestimonial(index, "avatar", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Avatar image URL"
                />
              </div>
              <button
                onClick={() => removeTestimonial(index)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">FAQ</h3>
          <button
            onClick={addFAQ}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>
        <div className="space-y-4">
          {content.faq.map((faq, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, "question", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Question"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Answer"
                />
              </div>
              <button
                onClick={() => removeFAQ(index)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesignTab = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-4">
          {["default", "minimal", "modern", "classic"].map((theme) => (
            <button
              key={theme}
              onClick={() =>
                setDesign((prev) => ({ ...prev, theme: theme as any }))
              }
              className={`p-4 border rounded-lg text-center capitalize ${
                design.theme === theme
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) =>
                  setDesign((prev) => ({
                    ...prev,
                    primaryColor: e.target.value,
                  }))
                }
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={design.primaryColor}
                onChange={(e) =>
                  setDesign((prev) => ({
                    ...prev,
                    primaryColor: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={design.backgroundColor}
                onChange={(e) =>
                  setDesign((prev) => ({
                    ...prev,
                    backgroundColor: e.target.value,
                  }))
                }
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={design.backgroundColor}
                onChange={(e) =>
                  setDesign((prev) => ({
                    ...prev,
                    backgroundColor: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={design.textColor}
                onChange={(e) =>
                  setDesign((prev) => ({ ...prev, textColor: e.target.value }))
                }
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={design.textColor}
                onChange={(e) =>
                  setDesign((prev) => ({ ...prev, textColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={design.fontFamily}
            onChange={(e) =>
              setDesign((prev) => ({ ...prev, fontFamily: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Poppins">Poppins</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Custom CSS</h3>
        <textarea
          value={design.customCSS}
          onChange={(e) =>
            setDesign((prev) => ({ ...prev, customCSS: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          rows={8}
          placeholder="/* Add your custom CSS here */"
        />
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) =>
                setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Page title for search engines"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {seo.metaTitle?.length || 0}/60 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={seo.metaDescription}
              onChange={(e) =>
                setSeo((prev) => ({ ...prev, metaDescription: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Description for search engines"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {seo.metaDescription?.length || 0}/160 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {seo.metaKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add keyword and press Enter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Graph Image URL
            </label>
            <input
              type="url"
              value={seo.ogImage}
              onChange={(e) =>
                setSeo((prev) => ({ ...prev, ogImage: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/og-image.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Preview Mode:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded ${
                previewMode === "desktop"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-2 rounded ${
                previewMode === "tablet"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded ${
                previewMode === "mobile"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => onPreview && onPreview({ design, content, seo })}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Eye className="w-4 h-4" />
          <span>Open Preview</span>
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={`bg-white border rounded-lg overflow-hidden ${
          previewMode === "desktop"
            ? "w-full"
            : previewMode === "tablet"
            ? "w-3/4 mx-auto"
            : "w-1/2 mx-auto"
        }`}
      >
        <div className="bg-gray-100 p-2 text-center text-xs text-gray-600">
          Preview - {previewMode}
        </div>
        <div
          className="p-8"
          style={{
            backgroundColor: design.backgroundColor,
            color: design.textColor,
            fontFamily: design.fontFamily,
          }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            {content.heroImage && (
              <img
                src={content.heroImage}
                alt="Hero"
                className="w-32 h-32 mx-auto mb-6 rounded-lg object-cover"
              />
            )}
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: design.primaryColor }}
            >
              {content.heroTitle}
            </h1>
            {content.heroSubtitle && (
              <p className="text-xl text-gray-600 mb-8">
                {content.heroSubtitle}
              </p>
            )}
            <button
              className="px-8 py-3 text-white font-semibold rounded-lg"
              style={{ backgroundColor: design.primaryColor }}
            >
              {content.callToAction.buttonText}
            </button>
          </div>

          {/* Features */}
          {content.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: design.primaryColor + "20" }}
                    >
                      <span
                        className="text-lg"
                        style={{ color: design.primaryColor }}
                      >
                        ✓
                      </span>
                    </div>
                    <p className="font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {content.testimonials.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                What Readers Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      {testimonial.avatar && (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      )}
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {content.faq.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {content.faq.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Landing Page Builder
        </h1>
        <p className="text-gray-600">
          Create a beautiful landing page for your book
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: "content", label: "Content", icon: Type },
          { id: "design", label: "Design", icon: Palette },
          { id: "seo", label: "SEO", icon: Settings },
          { id: "preview", label: "Preview", icon: Eye },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
              activeTab === id
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === "content" && renderContentTab()}
        {activeTab === "design" && renderDesignTab()}
        {activeTab === "seo" && renderSEOTab()}
        {activeTab === "preview" && renderPreview()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Landing Page"}</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPageBuilder;
