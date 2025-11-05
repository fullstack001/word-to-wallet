"use client";

import React, { useState } from "react";
import { AuctionSnapshot } from "@/types/auction";
import { auctionApi } from "@/services/auctionApi";

interface AuctionBiddingProps {
  auction: AuctionSnapshot;
  onBidPlaced: () => void;
  isAuthenticated: boolean;
}

const AuctionBidding: React.FC<AuctionBiddingProps> = ({
  auction,
  onBidPlaced,
  isAuthenticated,
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    country: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const canBid = auction.status === "active" && isAuthenticated;
  const minimumBid = auction.highBid + 1; // Assuming 1 unit minimum increment

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canBid) return;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      setError(`Minimum bid is ${auction.currency} ${minimumBid.toFixed(2)}`);
      return;
    }

    // Validate shipping information
    if (
      !shippingInfo.country ||
      !shippingInfo.street ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.phone ||
      !shippingInfo.email
    ) {
      setError("Please fill in all shipping information fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auctionApi.placeBid(auction.id, {
        amount,
        shippingInfo,
      });
      setSuccess("Bid placed successfully!");
      setBidAmount("");
      setShippingInfo({
        country: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
      });
      onBidPlaced();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!canBid || !auction.buyNowPrice) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auctionApi.buyNow(auction.id);
      setSuccess("Auction purchased successfully!");
      onBidPlaced();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to buy now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Bid Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Current Bid:</span>
            <span className="ml-2 font-semibold">
              {auction.currency} {auction.highBid.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Minimum Bid:</span>
            <span className="ml-2 font-semibold">
              {auction.currency} {minimumBid.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Form */}
      <form onSubmit={handleBidSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bidAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Bid Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">{auction.currency}</span>
            </div>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={minimumBid}
              step="0.01"
              placeholder={minimumBid.toFixed(2)}
              disabled={!canBid || loading}
              className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Shipping Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                value={shippingInfo.country}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, country: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street or P.O. Box:
              </label>
              <input
                type="text"
                id="street"
                value={shippingInfo.street}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, street: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State:
              </label>
              <input
                type="text"
                id="state"
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Zip Code:
              </label>
              <input
                type="text"
                id="zipCode"
                value={shippingInfo.zipCode}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, email: e.target.value })
                }
                disabled={!canBid || loading}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!canBid || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Placing Bid..." : "Place Bid"}
          </button>

          {auction.buyNowPrice && (
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canBid || loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading
                ? "Processing..."
                : `Buy Now (${auction.currency} ${auction.buyNowPrice.toFixed(
                    2
                  )})`}
            </button>
          )}
        </div>
      </form>

      {/* Status Messages */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            You need to be logged in to place bids.
          </p>
        </div>
      )}

      {auction.status !== "active" && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-800">
            This auction is {auction.status} and not accepting bids.
          </p>
        </div>
      )}

      {/* Quick Bid Buttons */}
      {canBid && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Quick Bid:</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setBidAmount(minimumBid.toFixed(2))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              {auction.currency} {minimumBid.toFixed(2)}
            </button>
            <button
              onClick={() => setBidAmount((minimumBid + 5).toFixed(2))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              {auction.currency} {(minimumBid + 5).toFixed(2)}
            </button>
            <button
              onClick={() => setBidAmount((minimumBid + 10).toFixed(2))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              {auction.currency} {(minimumBid + 10).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionBidding;
