"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignForm from "@/components/marketing/CampaignForm";
import { useEmailCampaigns } from "@/hooks/useEmailCampaigns";
import {
  EnvelopeIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Campaign interface is now imported from the service

export default function MailCampaignsPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    campaigns,
    isLoading,
    error,
    createCampaign,
    deleteCampaign,
    refreshCampaigns,
  } = useEmailCampaigns({ autoFetch: true });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "sending":
        return "bg-yellow-100 text-yellow-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <EnvelopeIcon className="w-4 h-4" />;
      case "scheduled":
        return <ClockIcon className="w-4 h-4" />;
      case "sending":
        return <PlayIcon className="w-4 h-4" />;
      case "paused":
        return <PauseIcon className="w-4 h-4" />;
      case "draft":
        return <PencilIcon className="w-4 h-4" />;
      default:
        return <PencilIcon className="w-4 h-4" />;
    }
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCreateCampaignSubmit = async (campaignData: any) => {
    try {
      const newCampaign = await createCampaign(campaignData);
      setShowCreateModal(false);
      // Return the campaign so the form can handle receiver upload
      return newCampaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/marketing/campaigns/${campaignId}/edit`);
  };

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/marketing/campaigns/${campaignId}`);
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(campaignId);
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mail Campaigns
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage your email marketing campaigns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Go to Dashboard
              </button>
              <button
                onClick={handleCreateCampaign}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Campaigns
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Recipients
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns
                      .reduce((sum, c) => sum + c.analytics.totalRecipients, 0)
                      .toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Open Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length > 0
                      ? Math.round(
                          (campaigns.reduce(
                            (sum, c) => sum + c.analytics.opened,
                            0
                          ) /
                            campaigns.reduce(
                              (sum, c) => sum + c.analytics.totalRecipients,
                              0
                            )) *
                            100
                        ) || 0
                      : 0}
                    %
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Click Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length > 0
                      ? Math.round(
                          (campaigns.reduce(
                            (sum, c) => sum + c.analytics.clicked,
                            0
                          ) /
                            campaigns.reduce(
                              (sum, c) => sum + c.analytics.totalRecipients,
                              0
                            )) *
                            100
                        ) || 0
                      : 0}
                    %
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Your Campaigns
            </h3>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No campaigns
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first email campaign.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateCampaign}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Campaign
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {campaign.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {campaign.subject}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>
                              Recipients:{" "}
                              {campaign.analytics.totalRecipients.toLocaleString()}
                            </span>
                            {campaign.analytics.totalRecipients > 0 && (
                              <>
                                <span>
                                  Opens:{" "}
                                  {campaign.analytics.opened.toLocaleString()}
                                </span>
                                <span>
                                  Clicks:{" "}
                                  {campaign.analytics.clicked.toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCampaign(campaign._id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Create Campaign Modal */}
      <CampaignForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaignSubmit}
      />
    </div>
  );
}
