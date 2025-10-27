"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  DocumentArrowUpIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Book } from "@/services/emailCampaignService";
import { useBooks } from "@/hooks/useBooks";
import { emailCampaignService } from "@/services/emailCampaignService";

// Book interface is now imported from the service

interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
  books: string[];
  selectedLink?: {
    linkId: string;
    linkUrl: string;
    linkType: "reader" | "landing_page" | "delivery_link";
  };
  senderInfo: {
    name: string;
    email: string;
    company?: string;
  };
  settings: {
    trackOpens: boolean;
    trackClicks: boolean;
    unsubscribeLink: boolean;
    replyTo?: string;
  };
  scheduledAt?: string;
}

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: CampaignFormData) => Promise<any>;
  initialData?: Partial<CampaignFormData>;
  campaignId?: string;
}

const defaultEmailContent = `Hi {{FirstName}},

I wanted to share something new with you that I think you'll find useful.

You can view the attached ePub for more details: {{AttachmentLink}}

Let me know what you think!

Best regards,
{{SenderEmail}}`;

export default function CampaignForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  campaignId,
}: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    subject: "",
    content: defaultEmailContent,
    books: initialData?.books?.length ? initialData.books : [],
    senderInfo: {
      name: "",
      email: "",
      company: "",
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      unsubscribeLink: true,
    },
    scheduledAt: "",
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "books" | "settings" | "receivers"
  >("content");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    count?: number;
    error?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    subject: "",
    content: "",
    book: "",
  });

  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [bookLinks, setBookLinks] = useState<any[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  const { books, isLoading, error: booksError } = useBooks();

  // Books are automatically fetched by the useBooks hook

  const convertToHtml = (text: string, usePreviewValues: boolean = false) => {
    let html = text;

    // Replace variables with sample values for preview or keep them for actual emails
    if (usePreviewValues) {
      html = html
        .replace(/\{\{FirstName\}\}/g, "John")
        .replace(/\{\{AttachmentLink\}\}/g, "https://example.com/book.epub")
        .replace(
          /\{\{SenderEmail\}\}/g,
          formData.senderInfo.email || "your@email.com"
        )
        .replace(/\{\{UnsubscribeLink\}\}/g, "https://example.com/unsubscribe");
    }

    // Escape any existing HTML in the content
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Convert line breaks to HTML
    html = html.replace(/\n\n+/g, "</p><p>"); // Multiple line breaks create new paragraphs
    html = html.replace(/\n/g, "<br>"); // Single line breaks
    html = `<p>${html}</p>`; // Wrap in paragraph tags

    // Convert URLs to clickable links
    html = html.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" style="color: #0066cc; text-decoration: none;">$1</a>'
    );

    // Create the email template with header, logo, and content
    const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Campaign</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                         <!-- Header with Logo -->
                     <tr>
                         <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                             <img src="https://dev.wordtowallet.com/logo.png" alt="Word2Wallet Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
                         </td>
                     </tr>
                    <!-- Content Area -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333333; line-height: 1.6;">
                                ${html}
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
                            <p style="font-size: 12px; color: #666666; margin: 0;">
                                © ${new Date().getFullYear()} Word2Wallet. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return emailTemplate.trim();
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      subject: "",
      content: "",
      book: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Campaign name must be at least 3 characters";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Email subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Email subject must be at least 5 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Email content is required";
    } else if (formData.content.trim().length < 20) {
      newErrors.content = "Email content is too short (minimum 20 characters)";
    }

    if (formData.books.length === 0) {
      newErrors.book = "Please select at least one book";
    } else if (!formData.selectedLink) {
      newErrors.book = "Please select a landing page or delivery link";
    }

    setErrors(newErrors);
    return (
      !newErrors.name &&
      !newErrors.subject &&
      !newErrors.content &&
      !newErrors.book
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Switch to the first tab with errors
      if (!formData.name || !formData.subject) {
        setActiveTab("content");
      } else if (formData.books.length === 0) {
        setActiveTab("books");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert plain text content to HTML
      const htmlContent = convertToHtml(formData.content, false);

      // Prepare the data to submit
      const dataToSubmit: any = {
        ...formData,
        content: htmlContent,
      };

      // Remove scheduledAt from body if it's not set
      if (!dataToSubmit.scheduledAt || dataToSubmit.scheduledAt === "") {
        delete dataToSubmit.scheduledAt;
      }

      // Submit with HTML content
      const newCampaign = await onSubmit(dataToSubmit);

      if (selectedFile && newCampaign?._id) {
        await handleUploadReceivers(newCampaign._id);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("senderInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        senderInfo: {
          ...prev.senderInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith("settings.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [field]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUploadReceivers = async (campaignId: string) => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await emailCampaignService.uploadReceivers(
        campaignId,
        selectedFile
      );
      if (response.success && response.data) {
        setUploadResult({
          success: true,
          count: response.data.count,
        });
      } else {
        setUploadResult({
          success: false,
          error: response.message || "Upload failed",
        });
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        error: error.message || "Network error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isUploading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
          onClick={handleClose}
        />

        <div className="inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {campaignId ? "Edit Campaign" : "Create New Campaign"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Set up your email marketing campaign
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting || isUploading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Campaign Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="e.g., Welcome Series - Day 1"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p
                      className="mt-1.5 text-sm text-red-600 flex items-center"
                      id="name-error"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    Choose a descriptive name to identify this campaign
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Subject Line
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors ${
                      errors.subject
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="e.g., Welcome to our community!"
                    aria-describedby={
                      errors.subject ? "subject-error" : undefined
                    }
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <p
                      className="mt-1.5 text-sm text-red-600 flex items-center"
                      id="subject-error"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    This is what recipients will see in their inbox
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    Character count: {formData.subject.length}/60
                    {formData.subject.length > 60 && (
                      <span className="text-orange-500 ml-1">
                        (Recommended max: 60)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8">
                  {[
                    {
                      id: "content",
                      name: "Email Content",
                      icon: DocumentArrowUpIcon,
                      hasError: !!errors.content,
                    },
                    {
                      id: "books",
                      name: "Books",
                      icon: BookOpenIcon,
                      hasError: !!errors.book,
                    },
                    {
                      id: "receivers",
                      name: selectedFile
                        ? `Receivers (${selectedFile.name.substring(0, 15)}...)`
                        : "Receivers",
                      icon: CloudArrowUpIcon,
                      hasError: false,
                    },
                    {
                      id: "settings",
                      name: "Settings",
                      icon: DocumentArrowUpIcon,
                      hasError: false,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`${
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } ${
                        tab.hasError ? "text-red-600" : ""
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center relative`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.name}
                      {tab.hasError && (
                        <ExclamationTriangleIcon className="h-4 w-4 ml-2 text-red-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Content
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowEmailPreview(!showEmailPreview)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                    >
                      {showEmailPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                  </div>

                  <div
                    className={
                      showEmailPreview
                        ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                        : ""
                    }
                  >
                    <div>
                      <textarea
                        name="content"
                        id="content"
                        rows={15}
                        value={formData.content}
                        onChange={handleChange}
                        required
                        className={`block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors ${
                          errors.content
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        placeholder="Enter your email content. Use variables like {{FirstName}}, {{AttachmentLink}}, {{SenderEmail}}"
                        aria-describedby={
                          errors.content ? "content-error" : undefined
                        }
                        aria-invalid={!!errors.content}
                      />
                      {errors.content && (
                        <p
                          className="mt-1.5 text-sm text-red-600 flex items-center"
                          id="content-error"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.content}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                        Use variables like {`{{FirstName}}`},{" "}
                        {`{{AttachmentLink}}`},{` {{SenderEmail}}`} in your
                        content
                      </p>
                    </div>

                    {showEmailPreview && (
                      <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700">
                            Email Preview
                          </span>
                          <span className="text-xs text-gray-500">
                            Variables shown with sample values
                          </span>
                        </div>
                        <div
                          className="bg-gray-100 p-4 overflow-auto flex-1"
                          style={{ maxHeight: "600px" }}
                        >
                          <div
                            className="bg-white mx-auto"
                            style={{
                              maxWidth: "600px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              minWidth: "600px",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: convertToHtml(formData.content, true),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "books" && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bookSelect"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Book to Attach
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">
                          Loading books...
                        </p>
                      </div>
                    ) : booksError ? (
                      <div className="text-center py-8 text-red-500">
                        <BookOpenIcon className="h-12 w-12 mx-auto mb-2" />
                        <p>Error loading books: {booksError}</p>
                      </div>
                    ) : books.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpenIcon className="h-12 w-12 mx-auto mb-2" />
                        <p>No books available. Upload some books first.</p>
                      </div>
                    ) : (
                      <select
                        id="bookSelect"
                        onChange={async (e) => {
                          const selectedBookId = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            books: selectedBookId ? [selectedBookId] : [],
                            selectedLink: undefined, // Reset selected link
                          }));
                          if (errors.book) {
                            setErrors((prev) => ({ ...prev, book: "" }));
                          }

                          // Fetch book links
                          if (selectedBookId) {
                            setIsLoadingLinks(true);
                            try {
                              const response =
                                await emailCampaignService.getBookLinks(
                                  selectedBookId
                                );
                              if (response.success && response.data) {
                                setBookLinks(response.data);
                              }
                            } catch (error) {
                              console.error(
                                "Error fetching book links:",
                                error
                              );
                              setBookLinks([]);
                            } finally {
                              setIsLoadingLinks(false);
                            }
                          } else {
                            setBookLinks([]);
                          }
                        }}
                        value={formData.books[0] || ""}
                        className={`mt-1 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors ${
                          errors.book
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        aria-describedby={
                          errors.book ? "book-error" : undefined
                        }
                        aria-invalid={!!errors.book}
                      >
                        <option value="">-- Select a book --</option>
                        {books.map((book) => (
                          <option key={book._id} value={book._id}>
                            {book.title} {book.author && `by ${book.author}`}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.book && (
                      <p
                        className="mt-1.5 text-sm text-red-600 flex items-center"
                        id="book-error"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.book}
                      </p>
                    )}
                    {formData.books.length > 0 && (
                      <p className="mt-2 text-sm text-green-600 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Book selected
                      </p>
                    )}
                  </div>

                  {/* Book Links Selection */}
                  {formData.books.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Link to Attach
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      {isLoadingLinks ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-500">
                            Loading links...
                          </p>
                        </div>
                      ) : bookLinks.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            No links found for this book.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {bookLinks.map((link) => (
                            <button
                              key={link._id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedLink: {
                                    linkId: link._id,
                                    linkUrl: link.url,
                                    linkType: link.linkType,
                                  },
                                }));
                              }}
                              className={`text-left p-4 rounded-lg border-2 transition-all ${
                                formData.selectedLink?.linkId === link._id
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-200 hover:border-indigo-300 bg-white"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                                        link.linkType === "reader"
                                          ? "bg-purple-100 text-purple-700"
                                          : link.linkType === "landing_page"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {link.linkType === "reader"
                                        ? "Reader Link"
                                        : link.linkType === "landing_page"
                                        ? "Landing Page"
                                        : "Delivery Link"}
                                    </span>
                                  </div>
                                  <p className="font-medium text-gray-900">
                                    {link.displayName}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1 truncate">
                                    {link.url}
                                  </p>
                                </div>
                                {formData.selectedLink?.linkId === link._id && (
                                  <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {formData.selectedLink && (
                        <p className="mt-2 text-sm text-green-600 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Link selected
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "receivers" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Receivers (CSV/Excel)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="receiver-file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="receiver-file-upload"
                              name="receiver-file-upload"
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              className="sr-only"
                              onChange={handleFileSelect}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          CSV, XLSX up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CloudArrowUpIcon className="h-5 w-5 text-green-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">
                              {selectedFile.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setUploadResult(null);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          aria-label="Remove file"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                      <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                      File Format Requirements:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2 ml-7">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>First row should contain column headers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Must include an "email" column (case insensitive)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Optional columns: "firstName", "lastName", or custom
                          fields
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Supported formats: CSV, XLSX, XLS</span>
                      </li>
                    </ul>
                  </div>

                  {uploadResult && (
                    <div
                      className={`rounded-lg p-5 ${
                        uploadResult.success
                          ? "bg-green-50 border border-green-300"
                          : "bg-red-50 border border-red-300"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {uploadResult.success ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          ) : (
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div className="ml-3">
                          {uploadResult.success ? (
                            <p className="text-sm font-medium text-green-900">
                              Successfully uploaded {uploadResult.count}{" "}
                              receivers!
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-red-900">
                              {uploadResult.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Note:</strong> Receivers
                      will be uploaded after the campaign is created. You can
                      also upload receivers later from the campaign management
                      page.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      Campaign Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                        <input
                          type="checkbox"
                          name="settings.trackOpens"
                          id="settings.trackOpens"
                          checked={formData.settings.trackOpens}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                        />
                        <label
                          htmlFor="settings.trackOpens"
                          className="ml-3 block text-sm text-gray-900"
                        >
                          Track email opens
                        </label>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                        <input
                          type="checkbox"
                          name="settings.trackClicks"
                          id="settings.trackClicks"
                          checked={formData.settings.trackClicks}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                        />
                        <label
                          htmlFor="settings.trackClicks"
                          className="ml-3 block text-sm text-gray-900"
                        >
                          Track link clicks
                        </label>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                        <input
                          type="checkbox"
                          name="settings.unsubscribeLink"
                          id="settings.unsubscribeLink"
                          checked={formData.settings.unsubscribeLink}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                        />
                        <label
                          htmlFor="settings.unsubscribeLink"
                          className="ml-3 block text-sm text-gray-900"
                        >
                          Include unsubscribe link
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <label
                      htmlFor="scheduledAt"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Schedule Campaign (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      id="scheduledAt"
                      value={formData.scheduledAt}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    />
                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                      <InformationCircleIcon className="h-4 w-4 mr-1" />
                      Leave empty to save as draft
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex w-full justify-center items-center rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isUploading
                      ? "Uploading Receivers..."
                      : "Creating Campaign..."}
                  </>
                ) : campaignId ? (
                  "Update Campaign"
                ) : (
                  "Create Campaign"
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || isUploading}
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
