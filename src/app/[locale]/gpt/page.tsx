"use client";

import React from "react";
import CustomGPTInterface from "@/components/admin/course/CustomGPTInterface";

const CustomGPTPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
            tutorials, and access open-source video tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomGPTPage;
