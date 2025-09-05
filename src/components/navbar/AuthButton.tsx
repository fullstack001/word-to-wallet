import React from "react";
import { LockIcon } from "lucide-react";
import type { AuthButtonProps } from "./types";

/**
 * Authentication button component for sign in/sign up actions
 */
export const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  label,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-2xl bg-white border-2 text-[#3758F9] border-[#3758F9] rounded-xl flex items-center hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      aria-label={label}
    >
      <LockIcon size={14} />
      <span className="ml-1 font-medium">{label}</span>
    </button>
  );
};
