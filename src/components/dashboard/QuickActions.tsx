"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  UserIcon,
  CalendarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CogIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

interface QuickActionsProps {
  onViewCourses: () => void;
  onViewProfile: () => void;
  onViewSchedule: () => void;
  onViewAchievements: () => void;
  onViewAuctions: () => void;
  onCreateAuction: () => void;
  onViewIntegrations: () => void;
  onViewDelivery: () => void;
}

export default function QuickActions({
  onViewCourses,
  onViewProfile,
  onViewSchedule,
  onViewAchievements,
  onViewAuctions,
  onCreateAuction,
  onViewIntegrations,
  onViewDelivery,
}: QuickActionsProps) {
  const actions = [
    {
      title: "Browse Courses",
      description: "Explore new learning opportunities",
      icon: BookOpenIcon,
      color: "purple",
      onClick: onViewCourses,
    },
    {
      title: "My Profile",
      description: "Update your personal information",
      icon: UserIcon,
      color: "blue",
      onClick: onViewProfile,
    },
    {
      title: "Schedule",
      description: "View your learning schedule",
      icon: CalendarIcon,
      color: "green",
      onClick: onViewSchedule,
    },
    {
      title: "Achievements",
      description: "Track your learning progress",
      icon: TrophyIcon,
      color: "yellow",
      onClick: onViewAchievements,
    },
    {
      title: "Browse Auctions",
      description: "Discover and bid on live auctions",
      icon: CurrencyDollarIcon,
      color: "red",
      onClick: onViewAuctions,
    },
    {
      title: "Create Auction",
      description: "List your items for auction",
      icon: PlusIcon,
      color: "green",
      onClick: onCreateAuction,
    },
    {
      title: "Integrations",
      description: "Connect your favorite tools",
      icon: CogIcon,
      color: "blue",
      onClick: onViewIntegrations,
    },
    {
      title: "Book Delivery",
      description: "Upload and distribute your books",
      icon: TruckIcon,
      color: "green",
      onClick: onViewDelivery,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 hover:bg-green-200",
      yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
      red: "bg-red-100 text-red-600 hover:bg-red-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.title}
              onClick={action.onClick}
              className={`p-4 rounded-lg border border-gray-200 text-left transition-all duration-200 ${getColorClasses(
                action.color
              )}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm opacity-75">{action.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
