"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Mail,
  Star,
  CheckCircle,
  User,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Music,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface PublicBookLandingProps {
  slug: string;
}

interface LandingPageData {
  _id: string;
  title: string;
  description?: string;
  design: {
    theme: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  content: {
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
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
    description?: string;
    coverImageUrl?: string;
    fileType: "epub" | "pdf" | "audio";
    pageCount?: number;
    wordCount?: number;
    readingTime?: number;
  };
}

const PublicBookLanding: React.FC<PublicBookLandingProps> = ({ slug }) => {
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchLandingPage();
  }, [slug]);

  const fetchLandingPage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/landing-pages/public/${slug}`);
      if (response.ok) {
        const result = await response.json();
        setLandingData(result.data);
      } else if (response.status === 401) {
        setShowPasswordForm(true);
      } else {
        setError("Landing page not found");
      }
    } catch (error) {
      console.error("Error fetching landing page:", error);
      setError("Failed to load landing page");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      alert("Please enter a password");
      return;
    }

    try {
      const response = await fetch(`/api/landing-pages/public/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const result = await response.json();
        setLandingData(result.data);
        setShowPasswordForm(false);
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Error submitting password:", error);
      alert("Failed to verify password");
    }
  };

  const handleEmailSubmit = async () => {
    if (!emailForm.email.trim()) {
      alert("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/landing-pages/${slug}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailForm),
      });

      if (response.ok) {
        setShowEmailForm(false);
        alert("Thank you! You can now download the book.");
        // Trigger download
        handleDownload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      alert("Failed to submit email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/delivery-links/download/${slug}`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        // Open download URL
        window.open(result.data.downloadUrl, "_blank");
      } else {
        const error = await response.json();
        if (error.message.includes("email")) {
          setShowEmailForm(true);
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Failed to download book");
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "audio":
        return <Music className="w-6 h-6 text-purple-500" />;
      default:
        return <BookOpen className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatReadingTime = (minutes?: number) => {
    if (!minutes) return "";
    if (minutes < 60) return `${minutes} min read`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m read`;
  };

  const sharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: landingData?.content.heroTitle,
        text: landingData?.content.heroSubtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              Protected Content
            </h1>
            <p className="text-gray-600 mt-2">
              This landing page is password protected
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Lock className="w-4 h-4" />
              <span>Access Content</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!landingData) return null;

  const { design, content, book } = landingData;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
        fontFamily: design.fontFamily,
      }}
    >
      {/* Custom CSS */}
      {design.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: design.customCSS }} />
      )}

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {content.heroImage && (
                <img
                  src={content.heroImage}
                  alt="Hero"
                  className="w-32 h-32 mx-auto lg:mx-0 mb-8 rounded-lg object-cover"
                />
              )}
              <h1
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: design.primaryColor }}
              >
                {content.heroTitle}
              </h1>
              {content.heroSubtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {content.heroSubtitle}
                </p>
              )}

              {/* Book Info */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  {getFileTypeIcon(book.fileType)}
                  <span className="capitalize text-gray-600">
                    {book.fileType}
                  </span>
                </div>
                {book.pageCount && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {book.pageCount} pages
                    </span>
                  </div>
                )}
                {book.readingTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {formatReadingTime(book.readingTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  {content.callToAction.text}
                </p>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center space-x-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: design.primaryColor }}
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {isDownloading
                      ? "Preparing..."
                      : content.callToAction.buttonText}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-80 h-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-80 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  {getFileTypeIcon(book.fileType)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {content.features.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: design.primaryColor + "20" }}
                  >
                    <CheckCircle
                      className="w-8 h-8"
                      style={{ color: design.primaryColor }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {content.testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Readers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
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
        </section>
      )}

      {/* About Author Section */}
      {content.aboutAuthor && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              About the Author
            </h2>
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {content.aboutAuthor.avatar && (
                <img
                  src={content.aboutAuthor.avatar}
                  alt={content.aboutAuthor.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              )}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">
                  {content.aboutAuthor.name}
                </h3>
                <p className="text-gray-700 mb-6">{content.aboutAuthor.bio}</p>
                {content.aboutAuthor.socialLinks && (
                  <div className="flex justify-center md:justify-start space-x-4">
                    {content.aboutAuthor.socialLinks.twitter && (
                      <a
                        href={content.aboutAuthor.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {content.aboutAuthor.socialLinks.facebook && (
                      <a
                        href={content.aboutAuthor.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {content.aboutAuthor.socialLinks.instagram && (
                      <a
                        href={content.aboutAuthor.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-600"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {content.aboutAuthor.socialLinks.website && (
                      <a
                        href={content.aboutAuthor.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {content.faq.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {content.faq.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg"
                >
                  <button
                    onClick={() => setShowFAQ(showFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {showFAQ === index ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {showFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: design.primaryColor + "10" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {content.callToAction.text}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of readers who have already downloaded this book
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: design.primaryColor }}
            >
              <Download className="w-5 h-5" />
              <span>
                {isDownloading
                  ? "Preparing..."
                  : content.callToAction.buttonText}
              </span>
            </button>
            <button
              onClick={sharePage}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Email Capture Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                Get Your Free Book
              </h3>
              <p className="text-gray-600 mt-2">
                Enter your email to download the book
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={emailForm.firstName}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={emailForm.lastName}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailSubmit}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Get Book"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicBookLanding;
