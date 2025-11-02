"use client";

import React from "react";
import { useLocalizedNavigation } from "@/utils/navigation";
import CustomGPTInterface from "@/components/admin/course/CustomGPTInterface";

const CustomGPTPage: React.FC = () => {
  const { navigate } = useLocalizedNavigation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
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
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            EPUB Prompt Architect
          </h1>
          <p className="text-gray-600">
            Your AI assistant for creating high-quality EPUB3 content and video
            tutorials
          </p>
        </div>

        <CustomGPTInterface />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by WordToWallet • Generate EPUB3 recipes, storyboarded
            tutorials
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomGPTPage;
