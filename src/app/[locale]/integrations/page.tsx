"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { BookFunnelConnectModal } from "@/components/integrations/BookFunnelConnectModal";

interface Integration {
  _id: string;
  provider: string;
  status: string;
  lastSync?: string;
  errorMessage?: string;
  settings?: any;
  createdAt: string;
}

export default function IntegrationsPage() {
  const t = useTranslations("integrations");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"
        }/integrations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleIntegrationConnected = () => {
    setShowConnectModal(false);
    fetchIntegrations();
  };

  const handleTestConnection = async (integrationId: string) => {
    setTesting(integrationId);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"
        }/integrations/${integrationId}/test`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        await fetchIntegrations();
      }
    } catch (error) {
      console.error("Failed to test connection:", error);
    } finally {
      setTesting(null);
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"
        }/integrations/${integrationId}/sync`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        await fetchIntegrations();
      }
    } catch (error) {
      console.error("Failed to sync:", error);
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm(t("confirmDisconnect"))) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"
        }/integrations/${integrationId}/disconnect`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        await fetchIntegrations();
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircleIcon,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: t("statusActive"),
        };
      case "inactive":
        return {
          icon: XCircleIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: t("statusInactive"),
        };
      case "error":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: t("statusError"),
        };
      case "pending":
        return {
          icon: ArrowPathIcon,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: t("statusPending"),
        };
      default:
        return {
          icon: XCircleIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: status,
        };
    }
  };

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case "bookfunnel":
        return {
          name: "BookFunnel",
          description: t("bookfunnelDescription"),
          logo: "📚",
          color: "bg-blue-500",
        };
      case "amazon_kdp":
        return {
          name: "Amazon KDP",
          description: t("amazonKdpDescription"),
          logo: "📖",
          color: "bg-orange-500",
        };
      case "draft2digital":
        return {
          name: "Draft2Digital",
          description: t("draft2digitalDescription"),
          logo: "📝",
          color: "bg-purple-500",
        };
      case "smashwords":
        return {
          name: "Smashwords",
          description: t("smashwordsDescription"),
          logo: "💥",
          color: "bg-red-500",
        };
      default:
        return {
          name: provider,
          description: "",
          logo: "🔗",
          color: "bg-gray-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <LinkIcon className="h-8 w-8 text-blue-600" />
                {t("title")}
              </h1>
              <p className="mt-2 text-gray-600">{t("subtitle")}</p>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t("connectIntegration")}
            </button>
          </div>
        </div>

        {/* Available Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("availableIntegrations")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* BookFunnel */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      BookFunnel
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("bookfunnelDescription")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    {t("connect")}
                  </button>
                </div>
              </div>
            </div>

            {/* Amazon KDP */}
            <div className="bg-white overflow-hidden shadow rounded-lg opacity-50">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Amazon KDP
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("amazonKdpDescription")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    disabled
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                  >
                    {t("comingSoon")}
                  </button>
                </div>
              </div>
            </div>

            {/* Draft2Digital */}
            <div className="bg-white overflow-hidden shadow rounded-lg opacity-50">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Draft2Digital
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("draft2digitalDescription")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    disabled
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                  >
                    {t("comingSoon")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Integrations */}
        {integrations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("connectedIntegrations")}
            </h2>
            <div className="space-y-4">
              {integrations.map((integration) => {
                const statusConfig = getStatusConfig(integration.status);
                const providerInfo = getProviderInfo(integration.provider);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={integration._id}
                    className={`bg-white overflow-hidden shadow rounded-lg border ${statusConfig.borderColor}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-12 w-12 ${providerInfo.color} rounded-lg flex items-center justify-center`}
                            >
                              <span className="text-2xl text-white">
                                {providerInfo.logo}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {providerInfo.name}
                            </h3>
                            <div className="flex items-center mt-1">
                              <StatusIcon
                                className={`h-4 w-4 ${statusConfig.color} mr-2`}
                              />
                              <span className={`text-sm ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            {integration.lastSync && (
                              <p className="text-sm text-gray-500 mt-1">
                                {t("lastSync")}:{" "}
                                {new Date(
                                  integration.lastSync
                                ).toLocaleString()}
                              </p>
                            )}
                            {integration.errorMessage && (
                              <p className="text-sm text-red-600 mt-1">
                                {integration.errorMessage}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {integration.status === "active" && (
                            <>
                              <button
                                onClick={() =>
                                  handleTestConnection(integration._id)
                                }
                                disabled={testing === integration._id}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                              >
                                {testing === integration._id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                )}
                                {t("test")}
                              </button>
                              <button
                                onClick={() => handleSync(integration._id)}
                                disabled={syncing === integration._id}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                              >
                                {syncing === integration._id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                                )}
                                {t("sync")}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDisconnect(integration._id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            {t("disconnect")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Connect Modal */}
        {showConnectModal && (
          <BookFunnelConnectModal
            onClose={() => setShowConnectModal(false)}
            onSuccess={handleIntegrationConnected}
          />
        )}
      </div>
    </div>
  );
}
