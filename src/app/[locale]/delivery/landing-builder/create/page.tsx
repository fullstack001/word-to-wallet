"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailSignupPageForm from "@/components/landing-pages/EmailSignupPageForm";
import DownloadPageForm from "@/components/landing-pages/DownloadPageForm";
import UniversalBookLinkForm from "@/components/landing-pages/UniversalBookLinkForm";
import RestrictedPageForm from "@/components/landing-pages/RestrictedPageForm";
import { landingPageApi } from "@/services/landingPageApi";
import { ArrowLeft } from "lucide-react";

export default function CreateLandingPagePage() {
  const searchParams = useSearchParams();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [bookId, setBookId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [emailOption, setEmailOption] = useState<string>("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const bookIdParam = searchParams.get("bookId");
    const typeParam = searchParams.get("type");
    const emailOptionParam = searchParams.get("emailOption");

    if (!bookIdParam || !typeParam) {
      navigate("/delivery/landing-builder");
      return;
    }

    setBookId(bookIdParam);
    setType(typeParam);
    setEmailOption(emailOptionParam || "required");
  }, [isLoggedIn, searchParams, navigate]);

  const handleBack = () => {
    navigate("/delivery/landing-builder");
  };

  const handleSave = async (data: any) => {
    try {
      // Pass the data directly to the API as it's already properly structured by the forms
      await landingPageApi.createLandingPage(data);
      navigate("/delivery/landing-builder");
    } catch (error) {
      console.error("Failed to create landing page:", error);
      alert("Failed to create landing page. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/delivery/landing-builder");
  };

  if (!isLoggedIn || !bookId || !type) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderForm = () => {
    switch (type) {
      case "email_signup":
        return (
          <EmailSignupPageForm
            bookId={bookId}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case "simple_download":
        return (
          <DownloadPageForm
            bookId={bookId}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      //   case "universal_link":
      //     return (
      //       <UniversalBookLinkForm
      //         bookId={bookId}
      //         onBack={handleBack}
      //         onSave={handleSave}
      //         onCancel={handleCancel}
      //       />
      //     );
      case "restricted":
        return (
          <RestrictedPageForm
            bookId={bookId}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Landing Page Type
              </h1>
              <p className="text-gray-600 mb-4">
                The selected landing page type is not supported.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Landing Pages
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-32">{renderForm()}</div>
      <Footer />
    </div>
  );
}
