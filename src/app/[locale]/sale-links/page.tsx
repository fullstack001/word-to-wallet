"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useLocalizedNavigation } from "../../../utils/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImageKey?: string;
  status: string;
}

interface SaleLink {
  _id: string;
  bookId: any;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  saleSettings?: {
    enabled: boolean;
    price?: number;
    currency?: string;
    salePageTitle?: string;
    salePageDescription?: string;
    paypalLink?: string;
    stripeLink?: string;
  };
  analytics: {
    totalViews: number;
  };
  createdAt: string;
}

export default function SaleLinksPage() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { navigate } = useLocalizedNavigation();

  const [books, setBooks] = useState<Book[]>([]);
  const [saleLinks, setSaleLinks] = useState<SaleLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SaleLink | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    bookId: "",
    title: "",
    description: "",
    price: "9.99",
    currency: "USD",
    salePageTitle: "",
    salePageDescription: "",
    paypalLink: "",
    stripeLink: "",
  });

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [booksRes, linksRes] = await Promise.all([
        api.get("/books"),
        api.get("/delivery-links"),
      ]);

      const readyBooks = booksRes.data.books.filter(
        (book: Book) => book.status === "ready" || book.status === "draft"
      );
      setBooks(readyBooks);

      // Filter to show only sale links
      const allLinks = linksRes.data.deliveryLinks || [];
      console.log("All delivery links:", allLinks);
      const saleLinksList = allLinks.filter(
        (link: SaleLink) => link.saleSettings?.enabled
      );
      console.log("Sale links only:", saleLinksList);
      setSaleLinks(saleLinksList);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSaleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.bookId) {
      setError("Please select a book");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    const hasPaypalLink =
      formData.paypalLink && formData.paypalLink.trim().length > 0;
    const hasStripeLink =
      formData.stripeLink && formData.stripeLink.trim().length > 0;

    if (!hasPaypalLink && !hasStripeLink) {
      setError("At least one payment link (PayPal or Stripe) is required");
      return;
    }

    try {
      const payload = {
        bookId: formData.bookId,
        title: formData.title,
        description: formData.description,
        settings: {
          requireEmail: true, // Always require email for all sale links
          allowAnonymous: false,
        },
        saleSettings: {
          enabled: true,
          price: parseFloat(formData.price),
          currency: formData.currency,
          salePageTitle: formData.salePageTitle || formData.title,
          salePageDescription:
            formData.salePageDescription || formData.description,
          paypalLink: formData.paypalLink,
          stripeLink: formData.stripeLink,
        },
      };

      console.log("Creating sale link with payload:", payload);
      await api.post("/delivery-links", payload);
      setSuccess("Sale link created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      // Extract error message from backend validation
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to create sale link";
      setError(errorMessage);
    }
  };

  const handleUpdateSaleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLink) return;

    setError(null);
    setSuccess(null);

    // Validate at least one payment link is provided
    const hasPaypalLink =
      formData.paypalLink && formData.paypalLink.trim().length > 0;
    const hasStripeLink =
      formData.stripeLink && formData.stripeLink.trim().length > 0;

    if (!hasPaypalLink && !hasStripeLink) {
      setError("At least one payment link (PayPal or Stripe) is required");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        settings: {
          requireEmail: true, // Always require email
          allowAnonymous: false,
        },
        saleSettings: {
          enabled: true,
          price: parseFloat(formData.price),
          currency: formData.currency,
          salePageTitle: formData.salePageTitle || formData.title,
          salePageDescription:
            formData.salePageDescription || formData.description,
          paypalLink: formData.paypalLink,
          stripeLink: formData.stripeLink,
        },
      };

      console.log("Updating sale link with payload:", payload);
      await api.put(`/delivery-links/${selectedLink._id}`, payload);
      setSuccess("Sale link updated successfully!");
      setShowEditModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      // Extract error message from backend validation
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to update sale link";
      setError(errorMessage);
    }
  };

  const handleEditClick = (link: SaleLink) => {
    setSelectedLink(link);
    setFormData({
      bookId: typeof link.bookId === "object" ? link.bookId._id : link.bookId,
      title: link.title,
      description: link.description || "",
      price: link.saleSettings?.price?.toString() || "9.99",
      currency: link.saleSettings?.currency || "USD",
      salePageTitle: link.saleSettings?.salePageTitle || "",
      salePageDescription: link.saleSettings?.salePageDescription || "",
      paypalLink: link.saleSettings?.paypalLink || "",
      stripeLink: link.saleSettings?.stripeLink || "",
    });
    setError(null);
    setSuccess(null);
    setShowEditModal(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this sale link?")) return;

    try {
      await api.delete(`/delivery-links/${linkId}`);
      setSuccess("Sale link deleted successfully!");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete sale link");
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: "",
      title: "",
      description: "",
      price: "9.99",
      currency: "USD",
      salePageTitle: "",
      salePageDescription: "",
      paypalLink: "",
      stripeLink: "",
    });
    setSelectedLink(null);
  };

  const getSaleUrl = (slug: string) => {
    return `${window.location.origin}/en/book/${slug}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Link copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen  flex items-center justify-center pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen  py-8 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book Sale Links
              </h1>
              <p className="mt-2 text-gray-600">
                Create sale pages with your own PayPal and Stripe payment links
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setError(null);
                  setSuccess(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + Create Sale Link
              </button>
            </div>
          </div>

          {/* Success Message - Only show when not in modal */}
          {success && !showCreateModal && !showEditModal && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Sale Links List */}
          {saleLinks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Sale Links Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first sale link to start selling your books
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setError(null);
                  setSuccess(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Your First Sale Link
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleLinks.map((link) => (
                <div
                  key={link._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {link.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          link.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {link.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {link.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold ml-2">
                          {link.saleSettings?.currency}{" "}
                          {link.saleSettings?.price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-semibold ml-2">
                          {link.analytics.totalViews}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {link.saleSettings?.paypalLink && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            💳 PayPal
                          </span>
                        )}
                        {link.saleSettings?.stripeLink && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            💳 Stripe
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                      <input
                        type="text"
                        value={getSaleUrl(link.slug)}
                        readOnly
                        className="flex-1 text-xs bg-transparent border-none focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(getSaleUrl(link.slug))}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={getSaleUrl(link.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleEditClick(link)}
                        className="flex-1 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link._id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Create Sale Link
                  </h2>

                  {/* Error Message in Modal */}
                  {error && showCreateModal && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleCreateSaleLink} className="space-y-4">
                    {/* Book Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Book *
                      </label>
                      <select
                        value={formData.bookId}
                        onChange={(e) =>
                          setFormData({ ...formData, bookId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Select a book --</option>
                        {books.map((book) => (
                          <option key={book._id} value={book._id}>
                            {book.title} by {book.author}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Buy My Awesome Book"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Short description"
                      />
                    </div>

                    {/* Price and Currency */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency *
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="9.99"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Links Section Header */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Payment Links (At least one required) *
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Add your own PayPal or Stripe payment links
                      </p>
                    </div>

                    {/* PayPal Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Buy Link
                      </label>
                      <input
                        type="url"
                        value={formData.paypalLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paypalLink: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.paypal.com/paypalme/yourusername"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Your PayPal.me link or PayPal buy button URL
                      </p>
                    </div>

                    {/* Stripe Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Payment Link
                      </label>
                      <input
                        type="url"
                        value={formData.stripeLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stripeLink: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://buy.stripe.com/..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Your Stripe Payment Link URL
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false);
                          resetForm();
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Sale Link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedLink && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Sale Link
                  </h2>

                  {/* Error Message in Modal */}
                  {error && showEditModal && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleUpdateSaleLink} className="space-y-4">
                    {/* Similar form fields as create */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency *
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Links Section Header */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Payment Links (At least one required) *
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Add your own PayPal or Stripe payment links
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Buy Link
                      </label>
                      <input
                        type="url"
                        value={formData.paypalLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paypalLink: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.paypal.com/paypalme/yourusername"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Payment Link
                      </label>
                      <input
                        type="url"
                        value={formData.stripeLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stripeLink: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://buy.stripe.com/..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Sale Link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
