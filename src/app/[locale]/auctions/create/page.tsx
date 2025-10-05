"use client";

import React from "react";
import { useLocalizedNavigation } from "@/utils/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateAuctionForm from "@/components/auction/CreateAuctionForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const CreateAuctionPage: React.FC = () => {
  const { navigate } = useLocalizedNavigation();

  const handleSuccess = (auctionId: string) => {
    navigate(`/auction/${auctionId}`);
  };

  const handleCancel = () => {
    navigate("/auctions/my");
  };

  const handleGoBack = () => {
    navigate("/auctions/my");
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8   pt-36">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to My Auctions
            </button>
          </div>

          <CreateAuctionForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default CreateAuctionPage;
