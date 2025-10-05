import { api } from "./api";
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

// Auction API service
export const auctionApi = {
  // Get auction snapshot
  getSnapshot: async (auctionId: string): Promise<AuctionSnapshot> => {
    const response = await api.get(`/auctions/${auctionId}/snapshot`);
    return response.data;
  },

  // Place a bid
  placeBid: async (
    auctionId: string,
    bidData: BidRequest
  ): Promise<AuctionSnapshot> => {
    const response = await api.post(`/auctions/${auctionId}/bids`, bidData);
    return response.data;
  },

  // Buy now
  buyNow: async (auctionId: string): Promise<AuctionSnapshot> => {
    const response = await api.post(`/auctions/${auctionId}/buy-now`);
    return response.data;
  },

  // Create offer
  createOffer: async (
    auctionId: string,
    offerData: OfferRequest
  ): Promise<Offer> => {
    const response = await api.post(`/auctions/${auctionId}/offers`, offerData);
    return response.data;
  },

  // Get auction offers
  getOffers: async (auctionId: string): Promise<Offer[]> => {
    const response = await api.get(`/auctions/${auctionId}/offers`);
    return response.data;
  },

  // Accept offer
  acceptOffer: async (offerId: string): Promise<void> => {
    await api.post(`/auctions/offers/${offerId}/accept`);
  },

  // Decline offer
  declineOffer: async (offerId: string): Promise<void> => {
    await api.post(`/auctions/offers/${offerId}/decline`);
  },

  // Get auction bids
  getBids: async (auctionId: string, limit = 50): Promise<Bid[]> => {
    const response = await api.get(`/auctions/${auctionId}/bids`, {
      params: { limit },
    });
    return response.data;
  },

  // Create auction
  createAuction: async (
    auctionData: CreateAuctionRequest
  ): Promise<Auction> => {
    const response = await api.post("/auctions", auctionData);
    return response.data;
  },

  // Get all auctions
  getAllAuctions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination: any }> => {
    const response = await api.get("/auctions", { params });
    return response.data;
  },

  // Get user's auctions
  getUserAuctions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination: any }> => {
    const response = await api.get("/auctions/my/auctions", { params });
    return response.data;
  },

  // Update auction
  updateAuction: async (
    auctionId: string,
    updateData: UpdateAuctionRequest
  ): Promise<Auction> => {
    const response = await api.put(`/auctions/${auctionId}`, updateData);
    return response.data;
  },

  // Delete auction
  deleteAuction: async (auctionId: string): Promise<void> => {
    await api.delete(`/auctions/${auctionId}`);
  },
};

export default auctionApi;
