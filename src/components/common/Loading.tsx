"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  message = "Loading...",
  size = "md",
  variant = "spinner",
  fullScreen = false,
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const renderSpinner = () => (
    <div
      className={`${sizeClasses[size]} border-4 border-purple-600 border-t-transparent rounded-full animate-spin`}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-purple-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-purple-600 rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );

  const renderSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center"
      >
        {renderLoader()}
        {message && (
          <motion.p
            className={`text-gray-600 mt-4 ${textSizeClasses[size]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

// Specialized loading components for different use cases
export function PageLoading({
  message = "Loading page...",
}: {
  message?: string;
}) {
  return <Loading message={message} size="lg" fullScreen />;
}

export function InlineLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return <Loading message={message} size="sm" variant="dots" />;
}

export function ButtonLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return <Loading message={message} size="sm" variant="spinner" />;
}

export function CardLoading() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Loading variant="skeleton" size="md" />
    </div>
  );
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      ))}
    </div>
  );
}
