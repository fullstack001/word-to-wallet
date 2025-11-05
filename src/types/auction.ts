export interface AuctionSnapshot {
  id: string;
  title: string;
  currency: string;
  highBid: number;
  leader: {
    id: string;
    name: string;
  } | null;
  online: number;
  start: string;
  end: string;
  reserveMet: boolean;
  status: AuctionStatus;
  buyNowPrice?: number;
  timeRemaining: number;
  images?: string[];
}

export enum AuctionStatus {
  SCHEDULED = "scheduled",
  ACTIVE = "active",
  PAUSED = "paused",
  ENDED = "ended",
  ENDED_NO_SALE = "ended_no_sale",
  SOLD = "sold",
  SOLD_BUY_NOW = "sold_buy_now",
  SOLD_OFFER = "sold_offer",
  CANCELLED = "cancelled",
}

export interface Bid {
  id: string;
  bidder: {
    id: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  timestamp: string;
  status: BidStatus;
}

export enum BidStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  OUTBID = "outbid",
}

export interface Offer {
  id: string;
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  status: OfferStatus;
  expiresAt: string;
  createdAt: string;
  counterOffer?: string;
}

export enum OfferStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
  COUNTERED = "countered",
}

export interface WebSocketMessage {
  type: "snapshot" | "bid_update" | "offer_update" | "error";
  data: any;
  auctionId: string;
}

export interface BidRequest {
  amount: number;
  shippingInfo?: {
    country: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
  };
}

export interface OfferRequest {
  amount: number;
}

export interface CounterOfferRequest {
  amount: number;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  currency: string;
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  currentBid?: number;
  highBidder?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: AuctionStatus;
  startTime: string;
  endTime: string;
  extendSeconds: number;
  minIncrement: number;
  images?: string[]; // Array of image URLs
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  currency?: string;
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  startTime: string;
  endTime: string;
  extendSeconds?: number;
  minIncrement?: number;
  images?: string[]; // Array of image URLs
}

export interface UpdateAuctionRequest {
  title?: string;
  description?: string;
  currency?: string;
  startingPrice?: number;
  reservePrice?: number;
  buyNowPrice?: number;
  startTime?: string;
  endTime?: string;
  extendSeconds?: number;
  minIncrement?: number;
}

export interface AuctionApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
