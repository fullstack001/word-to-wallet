"use client";

import React from "react";
import { motion } from "framer-motion";

interface SignupHeaderProps {
  currentStep: number;
}

export default function SignupHeader({ currentStep }: SignupHeaderProps) {
  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return "Get Platform Access";
      case 2:
        return "Complete Your Setup";
      default:
        return "Get Platform Access";
    }
  };

  const getSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Create your account to get started";
      case 2:
        return "Complete payment to start your 7-day free trial";
      default:
        return "Create your account to get started";
    }
  };

  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTitle()}</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{getSubtitle()}</p>
    </motion.div>
  );
}
