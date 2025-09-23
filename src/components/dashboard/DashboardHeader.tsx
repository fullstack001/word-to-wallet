"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClockIcon } from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
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

export default function DashboardHeader({
  userName,
  userEmail,
  subscription,
}: DashboardHeaderProps) {
  console.log(subscription);
  const getSubscriptionStatus = () => {
    if (subscription?.status === "trialing") {
      const trialEnd = subscription?.trialEnd;
      const daysRemaining = trialEnd
        ? Math.ceil(
            (new Date(trialEnd).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;
      return `Trial: ${daysRemaining} days remaining`;
    } else if (subscription?.status === "active") {
      return "Active Subscription";
    } else {
      return "No Subscription";
    }
  };

  return (
    <div className="pt-20 pb-8 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="text-4xl font-bold my-4 mt-12">
              Welcome back, {userName || userEmail}!
            </h1>
            <p className="text-xl text-purple-100 mb-6">Your dashboard</p>

            {/* Subscription Status */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <ClockIcon className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">
                {getSubscriptionStatus()}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
