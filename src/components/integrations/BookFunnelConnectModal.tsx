"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface BookFunnelConnectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function BookFunnelConnectModal({
  onClose,
  onSuccess,
}: BookFunnelConnectModalProps) {
  const t = useTranslations("integrations");
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError(t("apiKeyRequired"));
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/bookfunnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || t("connectionFailed"));
      }
    } catch (error) {
      console.error("Connection error:", error);
      setError(t("connectionFailed"));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {t("connectBookFunnel")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("connectBookFunnelDescription")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("apiKey")} *
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t("apiKeyPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">{t("apiKeyHelp")}</p>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <h4 className="font-medium mb-1">{t("howToGetApiKey")}</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t("step1")}</li>
                  <li>{t("step2")}</li>
                  <li>{t("step3")}</li>
                  <li>{t("step4")}</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              {t("features")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{t("feature1")}</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{t("feature2")}</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{t("feature3")}</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{t("feature4")}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={connecting || !apiKey.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? t("connecting") : t("connect")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
