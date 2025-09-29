"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocalizedNavigation } from "../../../utils/navigation";
import AuthGuard from "../../../components/auth/AuthGuard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AuctionList from "../../../components/auction/AuctionList";
import { AuctionStatus } from "../../../types/auction";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AuctionsPage: React.FC = () => {
  const t = useTranslations("auction");
  const { navigate } = useLocalizedNavigation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const statusOptions = [
    { value: "", label: t("filters.allAuctions") },
    { value: AuctionStatus.SCHEDULED, label: t("filters.scheduled") },
    { value: AuctionStatus.ACTIVE, label: t("filters.active") },
    { value: AuctionStatus.SOLD, label: t("filters.sold") },
    { value: AuctionStatus.ENDED, label: t("filters.ended") },
  ];

  const handleNavigateToMyAuctions = () => {
    navigate("/auctions/my");
  };

  const handleNavigateToCreateAuction = () => {
    navigate("/auctions/create");
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-36">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("title")}
                </h1>
                <p className="mt-2 text-gray-600">{t("subtitle")}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={handleNavigateToMyAuctions}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {t("myAuctions")}
                </button>
                <button
                  onClick={handleNavigateToCreateAuction}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("createAuction")}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auction List */}
          <AuctionList status={selectedStatus || undefined} limit={12} />
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AuctionsPage;
