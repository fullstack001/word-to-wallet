"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, feedback?: string) => void;
  isLoading?: boolean;
}

const cancellationReasons = [
  {
    id: "too-expensive",
    label: "Too expensive",
    description: "The subscription cost is too high for my budget",
  },
  {
    id: "not-using",
    label: "Not using the service",
    description: "I'm not actively using the features",
  },
  {
    id: "found-alternative",
    label: "Found a better alternative",
    description: "I found another service that better fits my needs",
  },
  {
    id: "technical-issues",
    label: "Technical issues",
    description: "Experiencing problems with the platform",
  },
  {
    id: "missing-features",
    label: "Missing features",
    description: "The service doesn't have features I need",
  },
  {
    id: "temporary",
    label: "Temporary break",
    description: "Taking a break but may return later",
  },
  {
    id: "other",
    label: "Other reason",
    description: "Please specify in the feedback section",
  },
];

export default function CancellationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleSubmit = () => {
    if (!selectedReason) return;

    if (selectedReason === "other" && !feedback.trim()) {
      alert("Please provide feedback for your cancellation reason.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm(selectedReason, feedback.trim() || undefined);
    setShowConfirmation(false);
    setSelectedReason("");
    setFeedback("");
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowConfirmation(false);
      setSelectedReason("");
      setFeedback("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl h-[95vh] sm:h-[90vh] flex flex-col"
        >
          {!showConfirmation ? (
            // Cancellation Form
            <div className="flex flex-col h-full">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-start sm:items-center justify-between">
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 bg-red-100 rounded-full flex-shrink-0">
                      <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                        Cancel Subscription
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                        We're sorry to see you go. Help us understand why you're
                        canceling.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                  >
                    <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Why are you canceling?
                  </h3>
                  <div className="grid gap-2 sm:gap-3">
                    {cancellationReasons.map((reason) => (
                      <label
                        key={reason.id}
                        className={`flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedReason === reason.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={() => handleReasonSelect(reason.id)}
                          className="mt-0.5 sm:mt-1 text-red-600 focus:ring-red-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {reason.label}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 leading-relaxed">
                            {reason.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedReason === "other" && (
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please tell us more
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Please provide more details about your cancellation reason..."
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 mt-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedReason || isLoading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    {isLoading ? "Processing..." : "Continue Cancellation"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Confirmation Step
            <div className="flex flex-col h-full">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Confirm Cancellation
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Are you sure you want to cancel your subscription? This
                    action cannot be undone.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs sm:text-sm text-yellow-800">
                        <p className="font-medium mb-1">Important:</p>
                        <p className="leading-relaxed">
                          Once canceled, you won't be able to start a new free
                          trial in the future. You'll need to subscribe directly
                          to access premium features.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 mt-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    {isLoading ? "Canceling..." : "Yes, Cancel Subscription"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
