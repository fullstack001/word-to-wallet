"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auctionApi } from "@/services/auctionApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

interface DemoAuction {
  _id: string;
  title: string;
  description: string;
  currency: string;
  startingPrice: number;
  currentBid: number;
  status: string;
  startTime: string;
  endTime: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

const DemoPage: React.FC = () => {
  const [auctions, setAuctions] = useState<DemoAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch demo auctions
  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/demo/auctions`
      );
      const data = await response.json();

      if (data.success) {
        setAuctions(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch auctions");
      }
    } catch (err: any) {
      setError("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  // Create demo auction
  const createDemoAuction = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/demo/auction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Demo auction created successfully!");
        fetchAuctions();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || "Failed to create demo auction");
      }
    } catch (err: any) {
      setError("Failed to create demo auction");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auction Demo</h1>
          <p className="mt-2 text-gray-600">
            This is a demonstration of the auction system. Create demo auctions
            and test the bidding functionality.
          </p>
        </div>

        {/* Create Demo Auction */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create Demo Auction
          </h2>
          <p className="text-gray-600 mb-4">
            Click the button below to create a new demo auction for testing.
          </p>
          <button
            onClick={createDemoAuction}
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
          >
            {creating ? "Creating..." : "Create Demo Auction"}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Demo Auctions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Demo Auctions
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No demo auctions found. Create one to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {auctions.map((auction) => (
                <div key={auction._id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {auction.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {auction.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Starting Price:</span>
                          <span className="ml-2 font-semibold">
                            {auction.currency}{" "}
                            {auction.startingPrice.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Current Bid:</span>
                          <span className="ml-2 font-semibold">
                            {auction.currency}{" "}
                            {(
                              auction.currentBid || auction.startingPrice
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              auction.status
                            )}`}
                          >
                            {auction.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ends:</span>
                          <span className="ml-2 font-semibold">
                            {formatDate(auction.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Link
                        href={`/auction/${auction._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        View Auction
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            How to Test
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>1. Click "Create Demo Auction" to create a new auction</p>
            <p>2. Click "View Auction" to open the auction page</p>
            <p>3. Use "Demo Login" to authenticate and place bids</p>
            <p>4. Test the WebSocket functionality by opening multiple tabs</p>
            <p>5. Try the "Buy Now" and "Make Offer" features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
