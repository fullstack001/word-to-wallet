"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaManagement from "@/components/media/MediaManagement";

export default function MediaPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-2">
            Upload, generate, and manage your media files (images, audio,
            videos)
          </p>
        </div>
        <MediaManagement />
      </div>
      <Footer />
    </div>
  );
}
