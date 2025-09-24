/**
 * Form wrapper component with built-in validation
 */

import React from "react";
import { UseFormValidationReturn } from "../../hooks/useFormValidation";

export interface ValidatedFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  validation: UseFormValidationReturn;
  className?: string;
  showGeneralError?: boolean;
  generalError?: string;
  loading?: boolean;
}

export default function ValidatedForm({
  children,
  onSubmit,
  validation,
  className = "",
  showGeneralError = true,
  generalError,
  loading = false,
}: ValidatedFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const result = validation.validate();
    if (result.isValid) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {showGeneralError && generalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{generalError}</p>
            </div>
          </div>
        </div>
      )}

      {children}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing...</span>
        </div>
      )}
    </form>
  );
}

/**
 * Form section component for grouping related fields
 */
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Form actions component for buttons
 */
export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function FormActions({
  children,
  className = "",
  align = "right",
}: FormActionsProps) {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={`flex space-x-3 ${alignmentClasses[align]} ${className}`}>
      {children}
    </div>
  );
}
