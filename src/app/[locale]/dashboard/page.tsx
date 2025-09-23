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

  const handleNavigateToAchievements = () => {
    navigate("/achievements");
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

          {/* Trial User Upgrade Prompt */}
          {user.subscription?.status === "trialing" && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Unlock All Features
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Upgrade to access book library, ARC campaigns, direct sales,
                    and marketing tools.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          <FeaturesSection
            onNavigateToCourses={handleNavigateToCourses}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToSchedule={handleNavigateToSchedule}
            onNavigateToAchievements={handleNavigateToAchievements}
            subscription={user.subscription}
          />
        </div>

        <div className="mt-8">
          <QuickActions
            onViewCourses={handleNavigateToCourses}
            onViewProfile={handleNavigateToProfile}
            onViewSchedule={handleNavigateToSchedule}
            onViewAchievements={handleNavigateToAchievements}
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
