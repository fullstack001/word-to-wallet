import axios from "axios";
import {
  AuctionSnapshot,
  Bid,
  Offer,
  BidRequest,
  OfferRequest,
  AuctionApiResponse,
  Auction,
  CreateAuctionRequest,
  UpdateAuctionRequest,
} from "../types/auction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const auctionApi = {
  // Demo login
  demoLogin: async (): Promise<
    AuctionApiResponse<{ token: string; user: any }>
  > => {
    const response = await apiClient.post("/demo/login");
    return response.data;
  },

  // Get auction snapshot
  getSnapshot: async (auctionId: string): Promise<AuctionSnapshot> => {
    const response = await apiClient.get(`/auctions/${auctionId}/snapshot`);
    return response.data.data;
  },

  // Place a bid
  placeBid: async (
    auctionId: string,
    bidData: BidRequest
  ): Promise<AuctionSnapshot> => {
    const response = await apiClient.post(
      `/auctions/${auctionId}/bids`,
      bidData
    );
    return response.data.data;
  },

  // Buy now
  buyNow: async (auctionId: string): Promise<AuctionSnapshot> => {
    const response = await apiClient.post(`/auctions/${auctionId}/buy-now`);
    return response.data.data;
  },

  // Create offer
  createOffer: async (
    auctionId: string,
    offerData: OfferRequest
  ): Promise<Offer> => {
    const response = await apiClient.post(
      `/auctions/${auctionId}/offers`,
      offerData
    );
    return response.data.data;
  },

  // Get auction offers
  getOffers: async (auctionId: string): Promise<Offer[]> => {
    const response = await apiClient.get(`/auctions/${auctionId}/offers`);
    return response.data.data;
  },

  // Accept offer
  acceptOffer: async (offerId: string): Promise<void> => {
    await apiClient.post(`/auctions/offers/${offerId}/accept`);
  },

  // Decline offer
  declineOffer: async (offerId: string): Promise<void> => {
    await apiClient.post(`/auctions/offers/${offerId}/decline`);
  },

  // Get auction bids
  getBids: async (auctionId: string, limit = 50): Promise<Bid[]> => {
    const response = await apiClient.get(
      `/auctions/${auctionId}/bids?limit=${limit}`
    );
    return response.data.data;
  },

  // Create auction
  createAuction: async (
    auctionData: CreateAuctionRequest
  ): Promise<Auction> => {
    const response = await apiClient.post("/auctions", auctionData);
    return response.data.data;
  },

  // Get all auctions
  getAllAuctions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination: any }> => {
    const response = await apiClient.get("/auctions", { params });
    return response.data.data;
  },

  // Get user's auctions
  getUserAuctions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination: any }> => {
    const response = await apiClient.get("/auctions/my/auctions", { params });
    return response.data.data;
  },

  // Update auction
  updateAuction: async (
    auctionId: string,
    updateData: UpdateAuctionRequest
  ): Promise<Auction> => {
    const response = await apiClient.put(`/auctions/${auctionId}`, updateData);
    return response.data.data;
  },

  // Delete auction
  deleteAuction: async (auctionId: string): Promise<void> => {
    await apiClient.delete(`/auctions/${auctionId}`);
  },
};

export default auctionApi;
