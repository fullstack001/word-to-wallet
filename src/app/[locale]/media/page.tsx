"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaManagement from "@/components/media/MediaManagement";
import { useLocalizedNavigation } from "@/utils/navigation";

export default function MediaPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Media Management
              </h1>
              <p className="text-gray-600 mt-2">
                You may upload your own media to use. Copy the url link and put
                it in your promotion. All images, audio, and video can also be
                inserted from other online sources (YouTube, Vimeo, etc.).
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
              Go to Dashboard
            </button>
          </div>
        </div>
        <MediaManagement />
      </div>
      <Footer />
    </div>
  );
}
