"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
}

interface CreateArcCampaignModalProps {
  books: Book[];
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateArcCampaignModal({
  books,
  onClose,
  onSuccess,
}: CreateArcCampaignModalProps) {
  const t = useTranslations("arc");
  const [formData, setFormData] = useState({
    bookId: "",
    campaignName: "",
    description: "",
    quantity: 1,
    maxDownloads: "",
    expiresAt: "",
    maxDownloadsPerCode: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookId || !formData.campaignName) {
      setError(t("bookAndNameRequired"));
      return;
    }

    if (formData.quantity < 1 || formData.quantity > 1000) {
      setError(t("invalidQuantity"));
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/arc/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookId: formData.bookId,
          campaignName: formData.campaignName,
          description: formData.description || undefined,
          quantity: formData.quantity,
          maxDownloads: formData.maxDownloads
            ? parseInt(formData.maxDownloads)
            : undefined,
          expiresAt: formData.expiresAt || undefined,
          maxDownloadsPerCode: formData.maxDownloadsPerCode
            ? parseInt(formData.maxDownloadsPerCode)
            : undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || t("creationFailed"));
      }
    } catch (error) {
      console.error("Campaign creation error:", error);
      setError(t("creationFailed"));
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedBook = books.find((book) => book._id === formData.bookId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("createCampaign")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("createCampaignDescription")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("selectBook")} *
            </label>
            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t("chooseBook")}</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
            {selectedBook && (
              <p className="mt-1 text-sm text-gray-500">
                {t("selectedBook")}: {selectedBook.title} by{" "}
                {selectedBook.author}
              </p>
            )}
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("campaignName")} *
            </label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleInputChange}
              placeholder={t("campaignNamePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder={t("descriptionPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campaign Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("numberOfCodes")} *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{t("quantityHelp")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("maxDownloadsPerCode")}
              </label>
              <input
                type="number"
                name="maxDownloadsPerCode"
                value={formData.maxDownloadsPerCode}
                onChange={handleInputChange}
                min="1"
                placeholder={t("unlimited")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("totalMaxDownloads")}
              </label>
              <input
                type="number"
                name="maxDownloads"
                value={formData.maxDownloads}
                onChange={handleInputChange}
                min="1"
                placeholder={t("unlimited")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("expirationDate")}
              </label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <h4 className="font-medium mb-1">{t("campaignInfo")}</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t("info1")}</li>
                  <li>{t("info2")}</li>
                  <li>{t("info3")}</li>
                  <li>{t("info4")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={creating || !formData.bookId || !formData.campaignName}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? t("creating") : t("createCampaign")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
