"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLocalizedNavigation } from "@/utils/navigation";
import { ArrowLeft } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
}

interface LandingPageBuilderFormProps {
  onBack?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
}

const LandingPageBuilderForm: React.FC<LandingPageBuilderFormProps> = ({
  onBack,
  onCancel,
  title = "Landing Page Builder",
  subtitle = "Create a new download page for your book",
  showBackButton = true,
  className = "",
}) => {
  const { navigate } = useLocalizedNavigation();
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [landingPageType, setLandingPageType] =
    useState<string>("email_signup");
  const [emailSignupOption, setEmailSignupOption] =
    useState<string>("required");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBooks(data.data.books || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleCreate = () => {
    if (!selectedBook) {
      alert("Please select a book first");
      return;
    }

    // Navigate to the specific landing page creation form
    const params = new URLSearchParams({
      bookId: selectedBook,
      type: landingPageType,
      emailOption: emailSignupOption,
    });

    navigate(`/delivery/landing-builder/create?${params.toString()}`);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/delivery/landing-builder");
    }
  };

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      <div className="mb-8">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Pages</span>
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Book Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Which book do you want to create a new download page for?
        </h2>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a book...</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      {/* Landing Page Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What kind of landing page do you want to create?
        </h2>

        <div className="space-y-4">
          {/* Email Signup Page */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="landingPageType"
                value="email_signup"
                checked={landingPageType === "email_signup"}
                onChange={(e) => setLandingPageType(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  An email signup page to collect new readers
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Word2Wallet will collect the reader's email address before
                  they can receive their book.
                </div>

                {landingPageType === "email_signup" && (
                  <div className="mt-4 pl-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Do you want to <strong>require</strong> the reader to join
                      your mailing list, or should the reader have the{" "}
                      <strong>option</strong> of joining?
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="emailSignupOption"
                          value="required"
                          checked={emailSignupOption === "required"}
                          onChange={(e) => setEmailSignupOption(e.target.value)}
                        />
                        <span className="text-sm">
                          The reader is required to join my list in order to
                          receive the book
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="emailSignupOption"
                          value="optional"
                          checked={emailSignupOption === "optional"}
                          onChange={(e) => setEmailSignupOption(e.target.value)}
                        />
                        <span className="text-sm">
                          The reader has the option to join my list and will
                          still receive the book
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="emailSignupOption"
                          value="data_collection"
                          checked={emailSignupOption === "data_collection"}
                          onChange={(e) => setEmailSignupOption(e.target.value)}
                        />
                        <span className="text-sm">
                          The reader can download the book and is not signing up
                          for a list (for data collection only)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Simple Download Page */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="landingPageType"
                value="simple_download"
                checked={landingPageType === "simple_download"}
                onChange={(e) => setLandingPageType(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  A simple download page without email collection
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Readers will be allowed to download without having to enter
                  their email address at all. This means that you won't be able
                  to track who is downloading, but it is the simplest way to
                  distribute a book to readers.
                </div>
              </div>
            </label>
          </div>

          {/* Universal Book Link */}
          {/* <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="landingPageType"
                value="universal_link"
                checked={landingPageType === "universal_link"}
                onChange={(e) => setLandingPageType(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  A universal book link where readers can choose from a list of
                  formats and bookstores online to buy your book
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Readers will be redirected to a bookstore or to your own store
                  or website in order to get their book. Word2Wallet does not
                  deliver any files with this kind of page, we're only hosting
                  the landing page and then directing the reader where to go.
                </div>
              </div>
            </label>
          </div> */}

          {/* Restricted Landing Page */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="landingPageType"
                value="restricted"
                checked={landingPageType === "restricted"}
                onChange={(e) => setLandingPageType(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  A restricted landing page for current subscribers
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Readers will be asked to give their email address, and then
                  Word2Wallet will confirm that they are actively subscribed to
                  one of your integrated lists before allowing them to download
                  the book. New readers (not already on your list) will not be
                  able to sign up for your list or download the content.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
        >
          Create Landing Page
        </button>
      </div>
    </div>
  );
};

export default LandingPageBuilderForm;
