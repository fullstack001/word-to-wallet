"use client";

import React, { useState, useEffect } from "react";
import { AuctionSnapshot, Offer } from "@/types/auction";
import { auctionApi } from "@/services/auctionApi";

interface AuctionOffersProps {
  auctionId: string;
  auction: AuctionSnapshot;
  onOfferUpdate: () => void;
  isAuthenticated: boolean;
}

const AuctionOffers: React.FC<AuctionOffersProps> = ({
  auctionId,
  auction,
  onOfferUpdate,
  isAuthenticated,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [offerAmount, setOfferAmount] = useState("");

  // Fetch offers
  const fetchOffers = async () => {
    try {
      const offersData = await auctionApi.getOffers(auctionId);
      setOffers(offersData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [auctionId]);

  const canMakeOffer = auction.status === "active" && isAuthenticated;

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canMakeOffer) return;

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount < auction.highBid) {
      setError(
        `Offer amount must be at least ${
          auction.currency
        } ${auction.highBid.toFixed(2)}`
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await auctionApi.createOffer(auctionId, { amount });
      setSuccess("Offer created successfully!");
      setOfferAmount("");
      fetchOffers();
      onOfferUpdate();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create offer");
    } finally {
      setSubmitting(false);
    }
  };

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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "countered":
        return "bg-blue-100 text-blue-800";
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

  return (
    <div className="space-y-6">
      {/* Create Offer Form */}
      {canMakeOffer && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Make an Offer
          </h3>

          <form onSubmit={handleOfferSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="offerAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Offer Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">
                    {auction.currency}
                  </span>
                </div>
                <input
                  type="number"
                  id="offerAmount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  min={auction.highBid}
                  step="0.01"
                  placeholder={auction.highBid.toFixed(2)}
                  disabled={submitting}
                  className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Minimum offer: {auction.currency} {auction.highBid.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
            >
              {submitting ? "Creating Offer..." : "Submit Offer"}
            </button>
          </form>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Offers List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Offers ({offers.length})
        </h3>

        {offers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No offers have been made yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {auction.currency} {offer.amount.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          offer.status
                        )}`}
                      >
                        {offer.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      From: {offer.buyer.firstName} {offer.buyer.lastName}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Created: {formatDate(offer.createdAt)}
                    </div>
                    {offer.status === "pending" && (
                      <div className="mt-1 text-sm text-gray-500">
                        Expires: {formatDate(offer.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            You need to be logged in to make offers.
          </p>
        </div>
      )}

      {auction.status !== "active" && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-800">
            This auction is {auction.status} and not accepting offers.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuctionOffers;
