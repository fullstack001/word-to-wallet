"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailMarketingIntegration from "@/components/integrations/EmailMarketingIntegration";
import PaymentGatewayIntegration from "@/components/integrations/PaymentGatewayIntegration";
import {
  Mail,
  CreditCard,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  Check,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "email_marketing" | "payment_gateway";
  status: "connected" | "not_connected" | "error";
  description: string;
  icon: React.ReactNode;
}

export default function IntegrationsPage() {
  const t = useTranslations("integrations");
  const [activeTab, setActiveTab] = useState<"email" | "payments" | "overview">(
    "overview"
  );
  const [userId] = useState("user_123"); // This would come from auth context

  const integrations: Integration[] = [
    {
      id: "mailchimp",
      name: "Mailchimp",
      type: "email_marketing",
      status: "connected",
      description: "Email marketing and automation",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "stripe",
      name: "Stripe",
      type: "payment_gateway",
      status: "connected",
      description: "Payment processing",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "convertkit",
      name: "ConvertKit",
      type: "email_marketing",
      status: "not_connected",
      description: "Creator-focused email marketing",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "paypal",
      name: "PayPal",
      type: "payment_gateway",
      status: "not_connected",
      description: "Global payment platform",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  const connectedIntegrations = integrations.filter(
    (i) => i.status === "connected"
  );
  const emailMarketingIntegrations = integrations.filter(
    (i) => i.type === "email_marketing"
  );
  const paymentGatewayIntegrations = integrations.filter(
    (i) => i.type === "payment_gateway"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "error":
        return "Error";
      default:
        return "Not Connected";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integrations
          </h1>
          <p className="text-gray-600">
            Connect your favorite tools to streamline your book delivery and
            marketing workflow
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Integrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                {/* Replace CheckCircle with a valid icon, e.g., Check */}
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connectedIntegrations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Email Marketing
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    emailMarketingIntegrations.filter(
                      (i) => i.status === "connected"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Payment Gateways
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    paymentGatewayIntegrations.filter(
                      (i) => i.status === "connected"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "email", label: "Email Marketing", icon: Mail },
                { id: "payments", label: "Payment Gateways", icon: CreditCard },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Connected Integrations */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Connected Integrations
                  </h2>
                  <p className="text-gray-600">Your active integrations</p>
                </div>
                <div className="p-6">
                  {connectedIntegrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {connectedIntegrations.map((integration) => (
                        <div
                          key={integration.id}
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-shrink-0">
                            {integration.icon}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-900">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {integration.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                integration.status
                              )}`}
                            >
                              {getStatusText(integration.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No integrations connected
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Connect your first integration to get started
                      </p>
                      <button
                        onClick={() => setActiveTab("email")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Browse Integrations
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      Email Marketing
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sync your reader emails with popular email marketing
                    platforms
                  </p>
                  <button
                    onClick={() => setActiveTab("email")}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Manage Email Integrations
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      Payment Gateways
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Accept payments for your books with secure payment
                    processing
                  </p>
                  <button
                    onClick={() => setActiveTab("payments")}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Manage Payment Integrations
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <EmailMarketingIntegration
              userId={userId}
              onIntegrationUpdate={() => {
                // Refresh data if needed
              }}
            />
          )}

          {activeTab === "payments" && (
            <PaymentGatewayIntegration
              userId={userId}
              onIntegrationUpdate={() => {
                // Refresh data if needed
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
