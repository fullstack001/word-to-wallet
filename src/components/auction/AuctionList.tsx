"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocalizedNavigation } from "../../utils/navigation";
import { auctionApi } from "../../services/auctionApi";
import { Auction, AuctionStatus } from "../../types/auction";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

interface AuctionListProps {
  showUserAuctions?: boolean;
  status?: string;
  limit?: number;
}

const AuctionList: React.FC<AuctionListProps> = ({
  showUserAuctions = false,
  status,
  limit = 10,
}) => {
  const t = useTranslations("auction");
  const { navigate } = useLocalizedNavigation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    pages: 0,
  });

  const fetchAuctions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        ...(status && { status }),
      };

      const response = showUserAuctions
        ? await auctionApi.getUserAuctions(params)
        : await auctionApi.getAllAuctions(params);

      console.log("Auction data received:", response.auctions);
      setAuctions(response.auctions);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch auctions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [status, limit]);

  const getStatusColor = (status: AuctionStatus) => {
    switch (status) {
      case AuctionStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800";
      case AuctionStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case AuctionStatus.SOLD:
      case AuctionStatus.SOLD_BUY_NOW:
      case AuctionStatus.SOLD_OFFER:
        return "bg-purple-100 text-purple-800";
      case AuctionStatus.ENDED:
      case AuctionStatus.ENDED_NO_SALE:
        return "bg-gray-100 text-gray-800";
      case AuctionStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: AuctionStatus) => {
    switch (status) {
      case AuctionStatus.SCHEDULED:
        return t("status.scheduled");
      case AuctionStatus.ACTIVE:
        return t("status.active");
      case AuctionStatus.SOLD:
        return t("status.sold");
      case AuctionStatus.SOLD_BUY_NOW:
        return t("status.soldBuyNow");
      case AuctionStatus.SOLD_OFFER:
        return t("status.soldOffer");
      case AuctionStatus.ENDED:
        return t("status.ended");
      case AuctionStatus.ENDED_NO_SALE:
        return t("status.endedNoSale");
      case AuctionStatus.CANCELLED:
        return t("status.cancelled");
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (endTime: string, status: AuctionStatus) => {
    if (status !== AuctionStatus.ACTIVE) return null;

    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const remaining = Math.max(0, end - now);

    if (remaining === 0) return "Ended";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleNavigateToCreateAuction = () => {
    navigate("/auctions/create");
  };

  const handleNavigateToAuction = (auctionId: string) => {
    navigate(`/auction/${auctionId}`);
  };

  if (loading && auctions.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">{t("noAuctionsFound")}</p>
        {showUserAuctions && (
          <button
            onClick={handleNavigateToCreateAuction}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {t("createFirstAuction")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {auction.title || "Untitled Auction"}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    auction.status
                  )}`}
                >
                  {getStatusText(auction.status)}
                </span>
              </div>

              {/* Product Image Thumbnail */}
              {auction.images && auction.images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={auction.images[0]}
                    alt={auction.title || "Auction item"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {auction.description || "No description available"}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Starting Price:</span>
                  <span className="font-medium">
                    {formatCurrency(auction.startingPrice, auction.currency)}
                  </span>
                </div>

                {auction.currentBid &&
                  auction.currentBid > auction.startingPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Bid:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(auction.currentBid, auction.currency)}
                      </span>
                    </div>
                  )}

                {auction.buyNowPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Buy Now:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(auction.buyNowPrice, auction.currency)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Starts:</span>
                  <span>{formatDate(auction.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ends:</span>
                  <span>{formatDate(auction.endTime)}</span>
                </div>
                {auction.status === AuctionStatus.ACTIVE && (
                  <div className="flex justify-between">
                    <span>Time Left:</span>
                    <span className="font-medium text-red-600">
                      {getTimeRemaining(auction.endTime, auction.status)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  by{" "}
                  {auction.createdBy
                    ? `${auction.createdBy.firstName} ${auction.createdBy.lastName}`
                    : "Unknown User"}
                </span>
                <button
                  onClick={() => handleNavigateToAuction(auction.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  View Auction
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => fetchAuctions(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => fetchAuctions(pagination.page + 1)}
            disabled={pagination.page === pagination.pages || loading}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionList;
