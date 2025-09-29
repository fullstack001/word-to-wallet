"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWebSocket } from "@/hooks/useWebSocket";
import { auctionApi } from "@/services/auctionApi";
import { AuctionSnapshot, WebSocketMessage } from "@/types/auction";
import { RootState } from "@/store/store";
import { login } from "@/store/slices/authSlice";
import AuctionHeader from "./AuctionHeader";
import AuctionBidding from "./AuctionBidding";
import AuctionOffers from "./AuctionOffers";
import AuctionBidHistory from "./AuctionBidHistory";
import AuctionImageGallery from "./AuctionImageGallery";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

interface AuctionViewProps {
  auctionId: string;
}

const AuctionView: React.FC<AuctionViewProps> = ({ auctionId }) => {
  console.log("AuctionView received auctionId:", auctionId);

  const [auction, setAuction] = useState<AuctionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bidding" | "offers" | "history">(
    "bidding"
  );
  const lastFetchTimeRef = useRef(0);

  // Get authentication state from Redux
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isLoggedIn
  );
  const dispatch = useDispatch();

  // Helper function to format time remaining based on auction status
  const formatTimeRemaining = (timeRemaining: number, status: string) => {
    // Handle different auction statuses
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "active":
        if (timeRemaining <= 0) {
          return "Ended";
        }
        // Format active time remaining
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = timeRemaining % 60;

        if (days > 0) {
          return `${days}d ${hours}h ${minutes}m`;
        }
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
          return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
      case "paused":
        return "Paused";
      case "ended":
      case "ended_no_sale":
        return "Ended";
      case "sold":
      case "sold_buy_now":
      case "sold_offer":
        return "Sold";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Helper function to get status description
  const getStatusDescription = (status: string) => {
    switch (status) {
      case "active":
        return "Auction Active";
      case "scheduled":
        return "Auction Scheduled";
      case "paused":
        return "Auction Paused";
      case "sold":
      case "sold_buy_now":
      case "sold_offer":
        return "Auction Sold";
      case "cancelled":
        return "Auction Cancelled";
      case "ended":
      case "ended_no_sale":
      default:
        return "Auction Ended";
    }
  };

  // Fetch auction snapshot with throttling
  const fetchAuctionSnapshot = useCallback(
    async (force = false) => {
      const now = Date.now();

      // Throttle requests to prevent too many API calls
      if (!force && now - lastFetchTimeRef.current < 2000) {
        console.log("Skipping fetch - too soon after last request");
        return;
      }

      lastFetchTimeRef.current = now;

      try {
        const snapshot = await auctionApi.getSnapshot(auctionId);
        setAuction(snapshot);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch auction data");
      } finally {
        setLoading(false);
      }
    },
    [auctionId]
  );

  // Initial load
  useEffect(() => {
    if (auctionId) {
      fetchAuctionSnapshot(true); // Force initial load
    }
  }, [auctionId, fetchAuctionSnapshot]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === "snapshot" && message.data) {
      setAuction(message.data);
    }
  }, []);

  // WebSocket connection (disabled by default to prevent errors - page works without it)
  const { isConnected, connectionError } = useWebSocket({
    auctionId,
    token:
      typeof window !== "undefined"
        ? localStorage.getItem("authToken") || undefined
        : undefined,
    onMessage: handleWebSocketMessage,
    onError: (error) => {
      console.warn(
        "WebSocket connection failed - auction will work in polling mode:",
        error
      );
    },
    enabled: true, // Enable WebSocket with improved error handling
  });

  // Auto-refresh auction data every 30 seconds as fallback (less frequent)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchAuctionSnapshot();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, fetchAuctionSnapshot]);

  // Handle authentication
  const handleDemoLogin = async () => {
    try {
      const response = await auctionApi.demoLogin();
      if (response.success && response.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", response.data.token);
        }
        dispatch(login());
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchAuctionSnapshot} />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Auction not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AuctionHeader
        auction={auction}
        isConnected={isConnected}
        connectionError={connectionError}
      />

      {/* WebSocket Connection Notice */}
      {connectionError && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Polling Mode Active:</strong> The auction page is
                working in polling mode. You can still view and bid on the
                auction. Updates are refreshed every 30 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to participate in this auction.
              </p>
              <div className="mt-2">
                <button
                  onClick={handleDemoLogin}
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-medium py-2 px-4 rounded-md text-sm"
                >
                  Demo Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Auction Info & Bidding */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <AuctionImageGallery
              images={auction.images || []}
              title={auction.title}
              className="bg-white rounded-lg shadow p-6"
            />

            {/* Auction Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {auction.title}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Current Bid:</span>
                  <span className="ml-2 font-semibold">
                    {auction.currency} {auction.highBid.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Leader:</span>
                  <span className="ml-2 font-semibold">
                    {auction.leader ? auction.leader.name : "No bids yet"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Online:</span>
                  <span className="ml-2 font-semibold">
                    {auction.online} users
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      auction.status === "active"
                        ? "bg-green-100 text-green-800"
                        : auction.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : auction.status === "paused"
                        ? "bg-yellow-100 text-yellow-800"
                        : auction.status === "sold" ||
                          auction.status === "sold_buy_now" ||
                          auction.status === "sold_offer"
                        ? "bg-purple-100 text-purple-800"
                        : auction.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {auction.status.charAt(0).toUpperCase() +
                      auction.status.slice(1).replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("bidding")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "bidding"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Bidding
                  </button>
                  <button
                    onClick={() => setActiveTab("offers")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "offers"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Offers
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "history"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Bid History
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "bidding" && (
                  <AuctionBidding
                    auction={auction}
                    onBidPlaced={fetchAuctionSnapshot}
                    isAuthenticated={isAuthenticated}
                  />
                )}
                {activeTab === "offers" && (
                  <AuctionOffers
                    auctionId={auctionId}
                    auction={auction}
                    onOfferUpdate={fetchAuctionSnapshot}
                    isAuthenticated={isAuthenticated}
                  />
                )}
                {activeTab === "history" && (
                  <AuctionBidHistory auctionId={auctionId} />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Timer & Status */}
          <div className="space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Time Remaining
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatTimeRemaining(auction.timeRemaining, auction.status)}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {getStatusDescription(auction.status)}
                </div>
              </div>
            </div>

            {/* Reserve Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reserve Status
              </h3>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    auction.reserveMet ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium">
                  {auction.reserveMet ? "Reserve Met" : "Reserve Not Met"}
                </span>
              </div>
            </div>

            {/* Buy Now */}
            {auction.buyNowPrice && auction.status === "active" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Buy Now
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {auction.currency} {auction.buyNowPrice.toFixed(2)}
                  </div>
                  <button
                    disabled={!isAuthenticated}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionView;
