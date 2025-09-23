"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

interface FeaturesSectionProps {
  onNavigateToCourses: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToAchievements: () => void;
  subscription?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status: string;
    plan: string;
    trialStart?: string;
    trialEnd?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: string;
  } | null;
}

export default function FeaturesSection({
  onNavigateToCourses,
  onNavigateToProfile,
  onNavigateToSchedule,
  onNavigateToAchievements,
  subscription,
}: FeaturesSectionProps) {
  // Check if user has active subscription (not trial)
  const hasActiveSubscription = subscription?.status === "active";
  const isTrialUser = subscription?.status === "trialing";

  const allFeatures = [
    {
      title: "Learning Dashboard",
      description: "Track your course progress and access learning materials",
      icon: BookOpenIcon,
      color: "purple",
      onClick: onNavigateToCourses,
      status: "active",
      features: ["Course Progress", "Learning Materials", "Achievements"],
      availableFor: ["trial", "paid"],
    },
    {
      title: "Book Library",
      description: "Upload and manage your EPUB3 books and metadata",
      icon: AcademicCapIcon,
      color: "green",
      onClick: () => {},
      status: hasActiveSubscription ? "active" : "locked",
      features: ["Book Upload", "Metadata Management", "File Storage"],
      availableFor: ["paid"],
    },
    {
      title: "ARC Campaigns",
      description: "Create and manage Advanced Reader Copy campaigns",
      icon: ChartBarIcon,
      color: "yellow",
      onClick: () => {},
      status: hasActiveSubscription ? "active" : "locked",
      features: ["Campaign Creation", "Download Codes", "Analytics"],
      availableFor: ["paid"],
    },
    {
      title: "Direct Sales",
      description: "Generate sales links and manage direct book sales",
      icon: TrophyIcon,
      color: "indigo",
      onClick: () => {},
      status: hasActiveSubscription ? "active" : "locked",
      features: ["Sales Links", "Order Management", "Revenue Tracking"],
      availableFor: ["paid"],
    },
    {
      title: "Marketing Tools",
      description: "Create and launch multi-channel marketing campaigns",
      icon: UserIcon,
      color: "pink",
      onClick: () => {},
      status: hasActiveSubscription ? "active" : "locked",
      features: ["Email Campaigns", "Social Media", "AI Copy Assistant"],
      availableFor: ["paid"],
    },
  ];

  // Show all features with appropriate status based on subscription
  const features = allFeatures.map((feature) => {
    let featureStatus = feature.status;

    // Course feature is always active for trial users
    if (feature.title === "Learning Dashboard" && isTrialUser) {
      featureStatus = "active";
    }
    // Override status based on subscription for locked features
    else if (feature.availableFor.includes("paid") && !hasActiveSubscription) {
      featureStatus = "locked";
    }

    return {
      ...feature,
      status: featureStatus,
    };
  });

  const getColorClasses = (color: string, status: string) => {
    const baseColorMap = {
      purple: "bg-purple-100 text-purple-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      indigo: "bg-indigo-100 text-indigo-600",
      pink: "bg-pink-100 text-pink-600",
    };

    const statusClasses = {
      active: "hover:bg-purple-200 cursor-pointer",
      pending: "hover:bg-blue-200 cursor-pointer",
      locked: "opacity-60 cursor-not-allowed",
    };

    const baseClasses =
      baseColorMap[color as keyof typeof baseColorMap] || baseColorMap.purple;
    const statusClass =
      statusClasses[status as keyof typeof statusClasses] ||
      statusClasses.locked;

    return `${baseClasses} ${statusClass}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { text: "Available", color: "bg-green-100 text-green-800" },
      pending: { text: "Coming Soon", color: "bg-yellow-100 text-yellow-800" },
      locked: {
        text: "Upgrade Required",
        color: "bg-orange-100 text-orange-800",
      },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.locked;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <motion.div
            key={feature.title}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 ${
              feature.status === "locked"
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-md cursor-pointer"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={feature.status !== "locked" ? { y: -4 } : {}}
            onClick={
              feature.status !== "locked"
                ? feature.onClick
                : feature.title === "Learning Dashboard" && isTrialUser
                ? feature.onClick
                : undefined
            }
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                    feature.color,
                    feature.status
                  )}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                {feature.status === "locked" && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <LockClosedIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {feature.description}
                </p>

                {/* Sub-features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {feature.features.map((subFeature, subIndex) => (
                    <span
                      key={subIndex}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {subFeature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  <span>
                    {feature.status === "locked"
                      ? "Upgrade to Unlock"
                      : feature.status === "active"
                      ? "Start Now"
                      : "Learn More"}
                  </span>
                  {(feature.status !== "locked" ||
                    (feature.title === "Learning Dashboard" &&
                      isTrialUser)) && (
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
