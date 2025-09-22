import React from "react";

interface BackButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "minimal";
}

/**
 * Reusable BackButton component with consistent styling and animations
 * Provides a user-friendly back navigation experience
 */
export default function BackButton({
  onClick,
  children,
  className = "",
  variant = "default",
}: BackButtonProps) {
  const baseClasses =
    "inline-flex items-center text-sm font-medium transition-colors duration-200 group";

  const variantClasses = {
    default:
      "px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg",
    minimal: "text-gray-500 hover:text-gray-700",
  };

  const iconClasses =
    variant === "default"
      ? "w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1"
      : "w-4 h-4 mr-2";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <svg
        className={iconClasses}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {children}
    </button>
  );
}
