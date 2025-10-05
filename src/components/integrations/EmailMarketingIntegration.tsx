"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Users,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  BarChart3,
} from "lucide-react";

interface EmailMarketingProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  supportedFeatures: string[];
}

interface EmailMarketingList {
  id: string;
  name: string;
  subscriberCount: number;
}

interface EmailMarketingIntegration {
  _id: string;
  provider: string;
  status: "active" | "inactive" | "error";
  lastRotateCcw?: string;
  errorMessage?: string;
  createdAt: string;
}

interface EmailMarketingIntegrationProps {
  userId: string;
  onIntegrationUpdate?: () => void;
}

const EmailMarketingIntegration: React.FC<EmailMarketingIntegrationProps> = ({
  userId,
  onIntegrationUpdate,
}) => {
  const [integrations, setIntegrations] = useState<EmailMarketingIntegration[]>(
    []
  );
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [lists, setLists] = useState<EmailMarketingList[]>([]);
  const [emailCaptures, setEmailCaptures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setRotateCcwing] = useState<string | null>(null);
  const [showRotateCcwModal, setShowRotateCcwModal] = useState(false);
  const [selectedCaptures, setSelectedCaptures] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<string>("");

  const providers: EmailMarketingProvider[] = [
    {
      id: "mailchimp",
      name: "Mailchimp",
      logo: "📧",
      description: "All-in-one marketing platform",
      supportedFeatures: ["Lists", "Segments", "Automation", "Analytics"],
    },
    {
      id: "convertkit",
      name: "ConvertKit",
      logo: "🎯",
      description: "Email marketing for creators",
      supportedFeatures: ["Forms", "Tags", "Automation", "Subscribers"],
    },
    {
      id: "active_campaign",
      name: "ActiveCampaign",
      logo: "⚡",
      description: "Customer experience automation",
      supportedFeatures: ["Lists", "Automation", "CRM", "Analytics"],
    },
    {
      id: "drip",
      name: "Drip",
      logo: "💧",
      description: "E-commerce CRM",
      supportedFeatures: ["Campaigns", "Segments", "Automation", "Analytics"],
    },
    {
      id: "sendinblue",
      name: "Sendinblue",
      logo: "📬",
      description: "Digital marketing platform",
      supportedFeatures: ["Lists", "Automation", "SMS", "Analytics"],
    },
  ];

  useEffect(() => {
    fetchIntegrations();
    fetchEmailCaptures();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/email-marketing/integrations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

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

  const fetchEmailCaptures = async () => {
    try {
      const response = await fetch("/api/email-captures", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmailCaptures(data.data.emailCaptures || []);
      }
    } catch (error) {
      console.error("Failed to fetch email captures:", error);
    }
  };

  const fetchLists = async (provider: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/email-marketing/integrations/${provider}/lists`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLists(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (provider: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/email-marketing/integrations/${provider}/test`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        await fetchIntegrations();
        if (onIntegrationUpdate) {
          onIntegrationUpdate();
        }
      }
    } catch (error) {
      console.error("Failed to test integration:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncEmailCaptures = async (
    provider: string,
    captureIds: string[],
    listId?: string
  ) => {
    try {
      setRotateCcwing(provider);
      const response = await fetch("/api/email-marketing/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          provider,
          emailCaptureIds: captureIds,
          listId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `RotateCcw completed: ${data.data.successful} successful, ${data.data.failed} failed`
        );
        setShowRotateCcwModal(false);
        setSelectedCaptures([]);
        setSelectedList("");
      }
    } catch (error) {
      console.error("Failed to sync email captures:", error);
    } finally {
      setRotateCcwing(null);
    }
  };

  const bulkRotateCcwEmailCaptures = async (
    provider: string,
    listId?: string
  ) => {
    try {
      setRotateCcwing(provider);
      const response = await fetch("/api/email-marketing/bulk-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          provider,
          listId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Bulk sync completed: ${data.data.successful} successful, ${data.data.failed} failed`
        );
      }
    } catch (error) {
      console.error("Failed to bulk sync email captures:", error);
    } finally {
      setRotateCcwing(null);
    }
  };

  const getProviderInfo = (providerId: string) => {
    return providers.find((p) => p.id === providerId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Email Marketing Integrations
          </h2>
          <p className="text-gray-600">
            Connect your email marketing platforms to sync reader data
          </p>
        </div>
        <button
          onClick={() => setShowRotateCcwModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RotateCcw Email Captures</span>
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => {
          const integration = integrations.find(
            (i) => i.provider === provider.id
          );
          const isConnected = integration && integration.status === "active";

          return (
            <div
              key={provider.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-1 ${getStatusColor(
                    integration?.status || "inactive"
                  )}`}
                >
                  {getStatusIcon(integration?.status || "inactive")}
                  <span className="text-sm font-medium">
                    {integration?.status || "Not Connected"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Supported Features:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {provider.supportedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedProvider(provider.id);
                        fetchLists(provider.id);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Users className="w-4 h-4" />
                      <span>View Lists</span>
                    </button>
                    <button
                      onClick={() => testIntegration(provider.id)}
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                      />
                      <span>Test Connection</span>
                    </button>
                    <button
                      onClick={() => bulkRotateCcwEmailCaptures(provider.id)}
                      disabled={syncing === provider.id}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                    >
                      <RotateCcw
                        className={`w-4 h-4 ${
                          syncing === provider.id ? "animate-spin" : ""
                        }`}
                      />
                      <span>Bulk RotateCcw</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      // This would open the integration setup modal
                      alert("Integration setup not implemented yet");
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                )}
              </div>

              {integration?.errorMessage && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {integration.errorMessage}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lists Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {getProviderInfo(selectedProvider)?.name} Lists
                </h3>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-3">
                  {lists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {list.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {list.subscriberCount.toLocaleString()} subscribers
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedList(list.id);
                          setShowRotateCcwModal(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        RotateCcw To
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RotateCcw Modal */}
      {showRotateCcwModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  RotateCcw Email Captures
                </h3>
                <button
                  onClick={() => setShowRotateCcwModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Email Captures
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {emailCaptures.map((capture) => (
                      <label
                        key={capture._id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCaptures.includes(capture._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCaptures([
                                ...selectedCaptures,
                                capture._id,
                              ]);
                            } else {
                              setSelectedCaptures(
                                selectedCaptures.filter(
                                  (id) => id !== capture._id
                                )
                              );
                            }
                          }}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {capture.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {capture.firstName} {capture.lastName} •{" "}
                            {capture.source}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRotateCcwModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedProvider && selectedCaptures.length > 0) {
                        syncEmailCaptures(
                          selectedProvider,
                          selectedCaptures,
                          selectedList
                        );
                      }
                    }}
                    disabled={
                      !selectedProvider || selectedCaptures.length === 0
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    RotateCcw Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarketingIntegration;
