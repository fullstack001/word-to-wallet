import { useState, useEffect } from "react";
import {
  emailCampaignService,
  EmailCampaign,
  CreateCampaignData,
  UpdateCampaignData,
} from "@/services/emailCampaignService";

export interface UseEmailCampaignsOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useEmailCampaigns = (options: UseEmailCampaignsOptions = {}) => {
  const { autoFetch = true, page = 1, limit = 10, search, status } = options;

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await emailCampaignService.getCampaigns({
        page,
        limit,
        search,
        status,
      });

      if (response.success && response.data) {
        setCampaigns(response.data.campaigns);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch campaigns");
      console.error("Error fetching campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (campaignData: CreateCampaignData) => {
    try {
      const response = await emailCampaignService.createCampaign(campaignData);
      if (response.success && response.data) {
        setCampaigns((prev) => [response.data!, ...prev]);
        return response.data;
      }
      throw new Error(response.message || "Failed to create campaign");
    } catch (err: any) {
      setError(err.message || "Failed to create campaign");
      throw err;
    }
  };

  const updateCampaign = async (
    campaignId: string,
    updateData: UpdateCampaignData
  ) => {
    try {
      const response = await emailCampaignService.updateCampaign(
        campaignId,
        updateData
      );
      if (response.success && response.data) {
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign._id === campaignId ? response.data! : campaign
          )
        );
        return response.data;
      }
      throw new Error(response.message || "Failed to update campaign");
    } catch (err: any) {
      setError(err.message || "Failed to update campaign");
      throw err;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const response = await emailCampaignService.deleteCampaign(campaignId);
      if (response.success) {
        setCampaigns((prev) =>
          prev.filter((campaign) => campaign._id !== campaignId)
        );
      } else {
        throw new Error(response.message || "Failed to delete campaign");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete campaign");
      throw err;
    }
  };

  const refreshCampaigns = () => {
    fetchCampaigns();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCampaigns();
    }
  }, [page, limit, search, status, autoFetch]);

  return {
    campaigns,
    isLoading,
    error,
    pagination,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns,
    fetchCampaigns,
  };
};

export const useEmailCampaign = (campaignId: string) => {
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    if (!campaignId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await emailCampaignService.getCampaign(campaignId);
      if (response.success && response.data) {
        setCampaign(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch campaign");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch campaign");
      console.error("Error fetching campaign:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  return {
    campaign,
    isLoading,
    error,
    fetchCampaign,
    refresh: fetchCampaign,
  };
};
