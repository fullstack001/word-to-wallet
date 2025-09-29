"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { auctionApi } from "../../services/auctionApi";
import { CreateAuctionRequest } from "../../types/auction";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import ImageUpload from "./ImageUpload";

interface CreateAuctionFormProps {
  onSuccess?: (auctionId: string) => void;
  onCancel?: () => void;
}

const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const t = useTranslations("auction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAuctionRequest>({
    title: "",
    description: "",
    currency: "USD",
    startingPrice: 0,
    reservePrice: undefined,
    buyNowPrice: undefined,
    startTime: "",
    endTime: "",
    extendSeconds: 30,
    minIncrement: 1,
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Price") ||
        name.includes("Increment") ||
        name.includes("Seconds")
          ? value
            ? parseFloat(value)
            : undefined
          : value,
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.startingPrice) {
        throw new Error(t("create.validation.titleRequired"));
      }

      if (formData.startingPrice <= 0) {
        throw new Error(t("create.validation.startingPriceRequired"));
      }

      if (
        formData.reservePrice &&
        formData.reservePrice <= formData.startingPrice
      ) {
        throw new Error(t("create.validation.reservePriceInvalid"));
      }

      if (
        formData.buyNowPrice &&
        formData.buyNowPrice <= formData.startingPrice
      ) {
        throw new Error(t("create.validation.buyNowPriceInvalid"));
      }

      if (
        formData.reservePrice &&
        formData.buyNowPrice &&
        formData.reservePrice > formData.buyNowPrice
      ) {
        throw new Error(t("create.validation.reservePriceTooHigh"));
      }

      if (!formData.startTime || !formData.endTime) {
        throw new Error(t("create.validation.titleRequired"));
      }

      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (endTime <= startTime) {
        throw new Error(t("create.validation.endTimeInvalid"));
      }

      if (startTime <= new Date()) {
        throw new Error(t("create.validation.startTimeInvalid"));
      }

      // Create auction
      const auction = await auctionApi.createAuction(formData);

      if (onSuccess) {
        onSuccess(auction.id);
      } else {
        router.push(`/auction/${auction.id}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to create auction"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now.toISOString().slice(0, 16);
  };

  const getMinEndTime = () => {
    if (!formData.startTime) return getMinDateTime();
    const startTime = new Date(formData.startTime);
    startTime.setMinutes(startTime.getMinutes() + 1);
    return startTime.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("create.title")}
      </h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("create.form.title")} *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("create.form.titlePlaceholder")}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            maxLength={2000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your auction item"
          />
        </div>

        {/* Product Images */}
        <ImageUpload
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">{t("currency.USD")}</option>
            <option value="EUR">{t("currency.EUR")}</option>
            <option value="GBP">{t("currency.GBP")}</option>
            <option value="CAD">{t("currency.CAD")}</option>
            <option value="AUD">{t("currency.AUD")}</option>
          </select>
        </div>

        {/* Starting Price */}
        <div>
          <label
            htmlFor="startingPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Starting Price *
          </label>
          <input
            type="number"
            id="startingPrice"
            name="startingPrice"
            value={formData.startingPrice || ""}
            onChange={handleInputChange}
            required
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* Reserve Price */}
        <div>
          <label
            htmlFor="reservePrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reserve Price (Optional)
          </label>
          <input
            type="number"
            id="reservePrice"
            name="reservePrice"
            value={formData.reservePrice || ""}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum price to sell"
          />
          <p className="text-sm text-gray-500 mt-1">
            The minimum price you're willing to accept. If not met, the auction
            won't sell.
          </p>
        </div>

        {/* Buy Now Price */}
        <div>
          <label
            htmlFor="buyNowPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buy Now Price (Optional)
          </label>
          <input
            type="number"
            id="buyNowPrice"
            name="buyNowPrice"
            value={formData.buyNowPrice || ""}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Instant purchase price"
          />
          <p className="text-sm text-gray-500 mt-1">
            Allow buyers to purchase immediately at this price.
          </p>
        </div>

        {/* Start Time */}
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Time *
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
            min={getMinDateTime()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Time */}
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            End Time *
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            required
            min={getMinEndTime()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Extend Seconds */}
        <div>
          <label
            htmlFor="extendSeconds"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Anti-Sniping Extension (seconds)
          </label>
          <input
            type="number"
            id="extendSeconds"
            name="extendSeconds"
            value={formData.extendSeconds || ""}
            onChange={handleInputChange}
            min="0"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="30"
          />
          <p className="text-sm text-gray-500 mt-1">
            Extend auction by this many seconds when bid is placed in the last
            minute.
          </p>
        </div>

        {/* Minimum Increment */}
        <div>
          <label
            htmlFor="minIncrement"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Minimum Bid Increment
          </label>
          <input
            type="number"
            id="minIncrement"
            name="minIncrement"
            value={formData.minIncrement || ""}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.00"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              t("create.form.createButton")
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {t("create.form.cancelButton")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAuctionForm;
