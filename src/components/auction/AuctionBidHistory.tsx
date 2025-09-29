"use client";

import React, { useState, useEffect } from "react";
import { Bid } from "@/types/auction";
import { auctionApi } from "@/services/auctionApi";

interface AuctionBidHistoryProps {
  auctionId: string;
}

const AuctionBidHistory: React.FC<AuctionBidHistoryProps> = ({ auctionId }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bid history
  const fetchBids = async () => {
    try {
      const bidsData = await auctionApi.getBids(auctionId, 100);
      setBids(bidsData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bid history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [auctionId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "outbid":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={fetchBids}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Bid History ({bids.length})
        </h3>
        <button
          onClick={fetchBids}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No bids have been placed yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">
                      ${bid.amount.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        bid.status
                      )}`}
                    >
                      {bid.status}
                    </span>
                    {index === 0 && bid.status === "accepted" && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Current High Bid
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    By: {bid.bidder.firstName} {bid.bidder.lastName}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {formatDate(bid.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    #{bids.length - index}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {bids.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Bids:</span>
              <span className="ml-2 font-medium">{bids.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Highest Bid:</span>
              <span className="ml-2 font-medium">
                ${Math.max(...bids.map((bid) => bid.amount)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Lowest Bid:</span>
              <span className="ml-2 font-medium">
                ${Math.min(...bids.map((bid) => bid.amount)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Average Bid:</span>
              <span className="ml-2 font-medium">
                $
                {(
                  bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionBidHistory;
