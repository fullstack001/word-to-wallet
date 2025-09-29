"use client";

import React from "react";
import { AuctionSnapshot } from "@/types/auction";

interface AuctionHeaderProps {
  auction: AuctionSnapshot;
  isConnected: boolean;
  connectionError?: string | null;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  auction,
  isConnected,
  connectionError,
}) => {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Auction Title */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {auction.title}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>Auction #{auction.id.slice(-8)}</span>
              <span>•</span>
              <span className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isConnected ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                {isConnected ? "Live" : "Polling Mode"}
              </span>
              {connectionError && (
                <>
                  <span>•</span>
                  <span className="text-red-500">{connectionError}</span>
                </>
              )}
            </div>
          </div>

          {/* Current Bid Display */}
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Bid</div>
            <div className="text-3xl font-bold text-gray-900">
              {auction.currency} {auction.highBid.toFixed(2)}
            </div>
            {auction.leader && (
              <div className="text-sm text-gray-500 mt-1">
                Leading: {auction.leader.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionHeader;
