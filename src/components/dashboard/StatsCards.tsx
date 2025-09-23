"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completedCourses,
      icon: CheckCircleIcon,
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats.inProgressCourses,
      icon: ClockIcon,
      color: "yellow",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Time Spent",
      value: `${stats.totalTimeSpent}h`,
      icon: ChartBarIcon,
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
