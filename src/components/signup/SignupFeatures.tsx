"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function SignupFeatures() {
  const features = [
    "7-day free trial (after payment)",
    "Full platform access",
    "Interactive ePub3 creation",
    "Multilingual support",
    "Direct email marketing tools",
    "Cancel anytime",
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          What you get with platform access:
        </h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Secure & Private
          </h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          We don't use any private information for anything other than login and
          relevant direct publications about technical updates/additions to the
          marketing platform.
        </p>
      </div>
    </motion.div>
  );
}
