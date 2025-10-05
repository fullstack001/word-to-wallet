"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react";
import { api } from "../../services";

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  supportedFeatures: string[];
  supportedCurrencies: string[];
}

interface PaymentGatewayIntegration {
  _id: string;
  provider: string;
  status: "active" | "inactive" | "error";
  lastSync?: string;
  errorMessage?: string;
  createdAt: string;
}

interface PaymentStats {
  integration: {
    _id: string;
    provider: string;
    status: string;
    lastSync?: string;
    errorMessage?: string;
    createdAt: string;
  };
  payments: {
    total: number;
    successful: number;
    failed: number;
    totalAmount: number;
  };
  subscriptions: {
    active: number;
    cancelled: number;
    total: number;
  };
}

interface PaymentGatewayIntegrationProps {
  userId: string;
  onIntegrationUpdate?: () => void;
}

const PaymentGatewayIntegration: React.FC<PaymentGatewayIntegrationProps> = ({
  userId,
  onIntegrationUpdate,
}) => {
  const [integrations, setIntegrations] = useState<PaymentGatewayIntegration[]>(
    []
  );
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "usd",
    description: "",
  });

  const providers: PaymentProvider[] = [
    {
      id: "stripe",
      name: "Stripe",
      logo: "💳",
      description: "Online payment processing",
      supportedFeatures: [
        "Payments",
        "Subscriptions",
        "Invoicing",
        "Marketplace",
      ],
      supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "🅿️",
      description: "Global payment platform",
      supportedFeatures: [
        "Payments",
        "Subscriptions",
        "Payouts",
        "Marketplace",
      ],
      supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"],
    },
    {
      id: "square",
      name: "Square",
      logo: "⬜",
      description: "Point of sale and payments",
      supportedFeatures: ["Payments", "Invoicing", "Terminal", "Online Store"],
      supportedCurrencies: ["USD", "CAD", "GBP", "AUD"],
    },
    {
      id: "razorpay",
      name: "Razorpay",
      logo: "🪒",
      description: "Payment gateway for India",
      supportedFeatures: [
        "Payments",
        "Subscriptions",
        "Payouts",
        "Smart Collect",
      ],
      supportedCurrencies: ["INR", "USD"],
    },
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payment-gateway/integrations");
      setIntegrations(response.data);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (provider: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/payment-gateway/integrations/${provider}/stats`
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (provider: string) => {
    try {
      setLoading(true);
      await api.post(`/payment-gateway/integrations/${provider}/test`);
      await fetchIntegrations();
      if (onIntegrationUpdate) {
        onIntegrationUpdate();
      }
    } catch (error) {
      console.error("Failed to test integration:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (
    provider: string,
    amount: number,
    currency: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment-gateway/payment-intents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          provider,
          amount,
          currency,
          metadata: {
            description: paymentData.description,
            userId,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Payment intent created: ${data.data.id}`);
        setShowPaymentModal(false);
        setPaymentData({ amount: "", currency: "usd", description: "" });
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Gateway Integrations
          </h2>
          <p className="text-gray-600">
            Connect payment processors to accept payments for your books
          </p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <DollarSign className="w-4 h-4" />
          <span>Test Payment</span>
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Currencies:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {provider.supportedCurrencies.map((currency) => (
                    <span
                      key={currency}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {currency}
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
                        fetchStats(provider.id);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>View Stats</span>
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
                  </>
                ) : (
                  <button
                    onClick={() => {
                      // This would open the integration setup modal
                      alert("Integration setup not implemented yet");
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

      {/* Stats Modal */}
      {selectedProvider && stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {getProviderInfo(selectedProvider)?.name} Statistics
                </h3>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment Statistics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payments:</span>
                      <span className="font-medium">
                        {stats.payments.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Successful:</span>
                      <span className="font-medium text-green-600">
                        {stats.payments.successful}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">
                        {stats.payments.failed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(stats.payments.totalAmount, "usd")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Subscription Statistics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total Subscriptions:
                      </span>
                      <span className="font-medium">
                        {stats.subscriptions.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-medium text-green-600">
                        {stats.subscriptions.active}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancelled:</span>
                      <span className="font-medium text-red-600">
                        {stats.subscriptions.cancelled}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Details */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Integration Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${getStatusColor(
                        stats.integration.status
                      )}`}
                    >
                      {stats.integration.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(
                        stats.integration.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {stats.integration.lastSync && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium">
                        {new Date(
                          stats.integration.lastSync
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Test Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Test Payment
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={paymentData.currency}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="cad">CAD</option>
                    <option value="aud">AUD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={paymentData.description}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Test payment"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (
                        paymentData.amount &&
                        parseFloat(paymentData.amount) > 0
                      ) {
                        // Use the first active integration for testing
                        const activeIntegration = integrations.find(
                          (i) => i.status === "active"
                        );
                        if (activeIntegration) {
                          createPaymentIntent(
                            activeIntegration.provider,
                            parseFloat(paymentData.amount),
                            paymentData.currency
                          );
                        } else {
                          alert("No active payment integration found");
                        }
                      }
                    }}
                    disabled={
                      !paymentData.amount || parseFloat(paymentData.amount) <= 0
                    }
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Create Payment Intent
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

export default PaymentGatewayIntegration;
