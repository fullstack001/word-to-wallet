"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";

interface BookData {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImageKey?: string;
  genre?: string[];
  tags?: string[];
}

interface DeliveryLinkData {
  _id: string;
  bookId: BookData;
  title: string;
  slug: string;
  description?: string;
  saleSettings?: {
    enabled: boolean;
    price?: number;
    currency?: string;
    salePageTitle?: string;
    salePageDescription?: string;
    paypalLink?: string;
    stripeLink?: string;
  };
}

export default function PublicBookPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [deliveryLink, setDeliveryLink] = useState<DeliveryLinkData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDeliveryLink();
    }
  }, [slug]);

  const fetchDeliveryLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch delivery link by slug
      const response = await api.get(`/delivery-links/slug/${slug}`);
      const link = response.data.deliveryLink;

      // Check if this is a sale link
      if (link.saleSettings?.enabled) {
        setDeliveryLink(link);
      } else {
        setError("This is not a sale page");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sale page");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !deliveryLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Available
          </h1>
          <p className="text-gray-600">{error || "Sale page not found"}</p>
        </div>
      </div>
    );
  }

  const book = deliveryLink.bookId;
  const settings = deliveryLink.saleSettings!;
  const displayTitle = settings.salePageTitle || book.title;
  const displayDescription =
    settings.salePageDescription || book.description || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">📚 Book Store</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            {book.coverImageKey && (
              <div className="md:w-2/5 bg-gradient-to-br from-gray-100 to-gray-200 p-12 flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="aspect-[2/3] relative shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/cover`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Book Details & Purchase */}
            <div
              className={`${
                book.coverImageKey ? "md:w-3/5" : "w-full"
              } p-8 md:p-12`}
            >
              <div className="space-y-6">
                {/* Title & Author */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {displayTitle}
                  </h1>
                  <p className="text-xl text-gray-600">by {book.author}</p>
                </div>

                {/* Genre Tags */}
                {book.genre && book.genre.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {book.genre.map((g, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {displayDescription && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {displayDescription}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="py-6 border-y border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-blue-600">
                      {settings.currency}
                    </span>
                    <span className="text-6xl font-bold text-blue-600">
                      {settings.price?.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    One-time purchase • Instant access
                  </p>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Choose Your Payment Method:
                  </h3>

                  {settings.stripeLink && (
                    <a
                      href={settings.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-center hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">💳</span>
                        <span>Pay with Credit Card (Stripe)</span>
                      </div>
                    </a>
                  )}

                  {settings.paypalLink && (
                    <a
                      href={settings.paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🅿️</span>
                        <span>Pay with PayPal</span>
                      </div>
                    </a>
                  )}

                  {!settings.stripeLink && !settings.paypalLink && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No payment methods available</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    What you&apos;ll get:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-500 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">
                        Instant digital download
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-500 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Read on any device</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-500 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Lifetime access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-500 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">
                        Secure payment processing
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Secure payment • Your information is protected
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
