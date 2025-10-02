"use client";
import React from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "red" | "yellow";
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = "md",
  color = "blue",
  className = "",
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  const progressBarClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${colorClasses[color]} ${progressBarClasses[size]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
