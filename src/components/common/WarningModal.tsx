/**
 * Reusable warning modal component
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "error" | "info";
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
}

export default function WarningModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  showCancelButton = true,
  showConfirmButton = true,
}: WarningModalProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "error":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "error":
        return {
          confirm: "bg-red-600 hover:bg-red-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
      case "info":
        return {
          confirm: "bg-blue-600 hover:bg-blue-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
      default:
        return {
          confirm: "bg-yellow-600 hover:bg-yellow-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${
                  type === "error" ? "red" : type === "info" ? "blue" : "yellow"
                }-100 sm:mx-0 sm:h-10 sm:w-10`}
              >
                <ExclamationTriangleIcon
                  className={`h-6 w-6 ${getIconColor()}`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Action buttons */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              {showConfirmButton && onConfirm && (
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonStyles.confirm}`}
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              )}
              {showCancelButton && (
                <button
                  type="button"
                  className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm ${buttonStyles.cancel}`}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Auto-dismissing warning notification for subject deletion
 */
export interface SubjectDeletionWarningProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  courseCount: number;
}

export function SubjectDeletionWarning({
  isOpen,
  onClose,
  subjectName,
  courseCount,
}: SubjectDeletionWarningProps) {
  const message = `Cannot delete "${subjectName}" because it contains ${courseCount} course${
    courseCount === 1 ? "" : "s"
  }. Please delete or move all courses from this subject before deleting it.`;

  return (
    <WarningModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cannot Delete Subject"
      message={message}
      type="error"
      showConfirmButton={false}
      showCancelButton={false}
    />
  );
}
