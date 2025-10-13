"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import WriteBookForm from "../../../components/writeBook/WriteBookForm";
import { generateBook } from "../../../utils/apiUtils";

export default function WriteBookPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{
    epub?: { path: string; url: string };
    pdf?: { path: string; url: string };
  } | null>(null);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleGenerate = async (data: {
    title: string;
    description?: string;
    chapters: Array<{
      id: string;
      title: string;
      description: string;
      content: string;
    }>;
    format: string[];
  }) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedFiles(null);

      const result = await generateBook(data);

      setGeneratedFiles(result.files);
    } catch (err) {
      console.error("Error generating book:", err);
      setError(err instanceof Error ? err.message : "Failed to generate book");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    // Remove /api from NEXT_PUBLIC_API_URL since static files are served from root
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
      "http://127.0.0.1:5000";
    link.href = `${baseUrl}${url}`;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setGeneratedFiles(null);
    setError(null);
  };

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Write Your Book
          </h1>
          <p className="text-gray-600">
            Create your book with chapters and generate EPUB or PDF formats
          </p>
        </div>

        {/* Success Message with Download Links */}
        {generatedFiles && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-green-800 mb-4">
                  Book Generated Successfully!
                </h3>
                <div className="space-y-3">
                  {generatedFiles.epub && (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <svg
                          className="w-8 h-8 text-purple-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">
                            EPUB Format
                          </p>
                          <p className="text-sm text-gray-500">
                            Perfect for e-readers
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDownload(generatedFiles.epub!.url, "book.epub")
                        }
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Download EPUB
                      </button>
                    </div>
                  )}
                  {generatedFiles.pdf && (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <svg
                          className="w-8 h-8 text-red-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">
                            PDF Format
                          </p>
                          <p className="text-sm text-gray-500">
                            Universal document format
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDownload(generatedFiles.pdf!.url, "book.pdf")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-green-700 hover:text-green-800 underline"
                >
                  Create another book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Write Book Form */}
        {!generatedFiles && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <WriteBookForm
              onSubmit={handleGenerate}
              loading={isGenerating}
              error={error}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
