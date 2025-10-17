"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import FeaturesSection from "../../../components/dashboard/FeaturesSection";
import QuickActions from "../../../components/dashboard/QuickActions";
import DashboardLoading from "../../../components/dashboard/DashboardLoading";
import DashboardError from "../../../components/dashboard/DashboardError";
import SubscriptionActions from "../../../components/subscription/SubscriptionActions";
import { useDashboardData } from "../../../hooks/useDashboardData";

export default function DashboardPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const { isLoading, hasError, isDataFetched, fetchData, retry } =
    useDashboardData();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Only fetch data once
    if (!isDataFetched && !hasError) {
      fetchData();
    }
  }, [isLoggedIn, navigate, isDataFetched, hasError, fetchData]);

  const handleNavigateToCourses = () => {
    navigate("/dashboard/course");
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const handleNavigateToSchedule = () => {
    navigate("/schedule");
  };

  const handleNavigateToBooks = () => {
    navigate("/books");
  };

  const handleNavigateToAchievements = () => {
    navigate("/achievements");
  };

  const handleNavigateToAuctions = () => {
    navigate("/auctions");
  };

  const handleNavigateToMyAuctions = () => {
    navigate("/auctions/my");
  };

  const handleNavigateToCreateAuction = () => {
    navigate("/auctions/create");
  };

  const handleNavigateToIntegrations = () => {
    navigate("/integrations");
  };

  const handleNavigateToDelivery = () => {
    navigate("/delivery");
  };
  const handleNavigateToSaleLinks = () => {
    navigate("/sale-links");
  };

  const handleNavigateToWriteBook = () => {
    navigate("/write-book?tab=write");
  };

  const handleNavigateToGPT = () => {
    navigate("/gpt");
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (hasError) {
    return <DashboardError onRetry={retry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <DashboardHeader
        userName={user.name}
        userEmail={user.email}
        subscription={user.subscription}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Platform Tools
          </h2>
          <p className="text-gray-600 mb-6">
            Access all the tools you need to manage your books, create
            campaigns, and grow your author business.
          </p>

          {/* Subscription Actions */}
          {/* <div className="mb-8">
            <SubscriptionActions user={user} />
          </div> */}

          <FeaturesSection
            onNavigateToCourses={handleNavigateToCourses}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToSchedule={handleNavigateToSchedule}
            onNavigateToBooks={handleNavigateToBooks}
            onNavigateToSaleLinks={handleNavigateToSaleLinks}
            onNavigateToAchievements={handleNavigateToAchievements}
            onNavigateToAuctions={handleNavigateToAuctions}
            onNavigateToMyAuctions={handleNavigateToMyAuctions}
            onNavigateToCreateAuction={handleNavigateToCreateAuction}
            onNavigateToIntegrations={handleNavigateToIntegrations}
            onNavigateToDelivery={handleNavigateToDelivery}
            onNavigateToWriteBook={handleNavigateToWriteBook}
            onNavigateToGPT={handleNavigateToGPT}
            subscription={user.subscription}
          />
        </div>

        <div className="mt-8">
          <QuickActions
            onViewCourses={handleNavigateToCourses}
            onViewProfile={handleNavigateToProfile}
            onViewSchedule={handleNavigateToSchedule}
            onViewAchievements={handleNavigateToAchievements}
            onViewAuctions={handleNavigateToAuctions}
            onCreateAuction={handleNavigateToCreateAuction}
            onViewIntegrations={handleNavigateToIntegrations}
            onViewDelivery={handleNavigateToDelivery}
            onViewSaleLinks={handleNavigateToSaleLinks}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-purple-100 mb-6">
                Our support team is here to help you succeed
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate("/faq")}
                  className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
