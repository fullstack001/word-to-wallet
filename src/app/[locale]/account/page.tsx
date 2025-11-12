"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedNavigation } from "../../../utils/navigation";
import { RootState } from "../../../store/store";
import { setUser } from "../../../store/slices/userSlice";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CancellationModal from "../../../components/subscription/CancellationModal";
import {
  cancelSubscription,
  upgradeSubscriptionDirect,
  changePassword,
} from "../../../utils/apiUtils";
import {
  ClockIcon,
  PlayIcon,
  XMarkIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import ChangePasswordModal from "../../../components/account/ChangePasswordModal";

export default function AccountPage() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const handleStartTrial = () => {
    navigate("/checkout");
  };

  const handleSubscribe = async () => {
    navigate("/checkout");
  };

  const handleDirectUpgrade = async (
    paymentMethodId: string,
    plan: string = "pro"
  ) => {
    try {
      const response = await upgradeSubscriptionDirect(paymentMethodId, plan);
      dispatch(
        setUser({
          id: "",
          name: user.name,
          email: user.email,
          cardnumber: "",
          avatar: "",
          isAdmin: false,
          subscription: {
            stripeCustomerId: response.data.subscription.stripeCustomerId,
            stripeSubscriptionId:
              response.data.subscription.stripeSubscriptionId,
            status: response.data.subscription.status,
            plan: response.data.subscription.plan,
            trialStart: response.data.subscription.trialStart,
            trialEnd: response.data.subscription.trialEnd,
            currentPeriodStart: response.data.subscription.currentPeriodStart,
            currentPeriodEnd: response.data.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: response.data.subscription.cancelAtPeriodEnd,
            canceledAt: response.data.subscription.canceledAt,
          },
        })
      );
      console.log("Subscription upgraded successfully");
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = async (
    reason: string,
    feedback?: string
  ) => {
    setIsCanceling(true);
    try {
      const response = await cancelSubscription(false, reason, feedback);
      dispatch(
        setUser({
          id: "",
          name: user.name,
          email: user.email,
          cardnumber: "",
          avatar: "",
          isAdmin: false,
          subscription: response.data.subscription,
        })
      );
      console.log("Subscription canceled successfully");
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await changePassword(currentPassword, newPassword);
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const getSubscriptionState = () => {
    if (!user.subscription) return "no-subscription";
    if (user.subscription.cancelAtPeriodEnd) {
      return "canceled";
    }
    if (user.subscription.status === "trialing") {
      if (
        user.subscription.trialEnd &&
        new Date(user.subscription.trialEnd) > new Date()
      ) {
        return "trial";
      } else {
        return "trial-expired";
      }
    }
    if (user.subscription.status === "active") {
      if (user.subscription.cancelAtPeriodEnd) {
        return "canceled-but-active";
      }
      return "active";
    }
    if (
      user.subscription.status === "canceled" ||
      user.subscription.plan === "free"
    ) {
      return "canceled";
    }
    return "no-subscription";
  };

  const getSubscriptionStatus = () => {
    const state = getSubscriptionState();
    switch (state) {
      case "no-subscription":
        return "No Subscription";
      case "trial":
        if (user.subscription?.trialEnd) {
          const daysRemaining = Math.ceil(
            (new Date(user.subscription.trialEnd).getTime() -
              new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return `Trial: ${Math.max(0, daysRemaining)} days remaining`;
        }
        return "Trial Active";
      case "trial-expired":
        return "Trial Expired";
      case "active":
        return "Pro";
      case "canceled-but-active":
        if (user.subscription?.currentPeriodEnd) {
          const endDate = new Date(user.subscription.currentPeriodEnd);
          const daysRemaining = Math.ceil(
            (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return `Canceled - ${Math.max(0, daysRemaining)} days remaining`;
        }
        return "Canceled - Active until period end";
      case "canceled":
        return "Subscription Canceled";
      default:
        return "No Subscription";
    }
  };

  const renderActionButton = () => {
    const state = getSubscriptionState();

    switch (state) {
      case "no-subscription":
        return (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white text-lg font-semibold mb-1">
                Try Word2Wallet Pro
              </h3>
              <p className="text-white text-lg font-bold mb-2">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold mr-2">
                  FREE
                </span>
                7 days free
              </p>
              <div className="text-white/80 text-sm">
                Then $19.99 per month starting{" "}
                <span className="font-semibold text-white">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-white/60 text-xs mt-1">
                Cancel anytime during trial
              </div>
            </div>

            <button
              onClick={handleStartTrial}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <PlayIcon className="w-5 h-5 mr-3 relative z-10" />
              <span className="relative z-10">Start Free Trial</span>
            </button>
          </div>
        );

      case "trial":
        return (
          <div className="flex flex-col items-end justify-end space-y-3">
            <button
              onClick={handleCancelSubscription}
              className="inline-flex items-center px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel Subscription
            </button>
          </div>
        );

      case "trial-expired":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Your trial has ended. Continue with full access
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CreditCardIcon className="w-5 h-5 mr-3" />
              Upgrade to Continue
            </button>
          </div>
        );

      case "active":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Manage your subscription
              </p>
            </div>
            <button
              onClick={handleCancelSubscription}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel Subscription
            </button>
          </div>
        );

      case "canceled-but-active":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Your subscription will end soon
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Renew Subscription
            </button>
          </div>
        );

      case "canceled":
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-2">
                Your subscription has been canceled
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Upgrade Plan
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Account Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 my-4 mt-12">
              <h1 className="text-4xl font-bold text-white">
                Account Settings
              </h1>

              {/* Subscription Status Banner */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                <ClockIcon className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">
                  {getSubscriptionStatus()}
                </span>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="flex flex-col items-center space-y-4">
              {/* Action Buttons */}
              {renderActionButton() && (
                <div className="mt-4">{renderActionButton()}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <UserIcon className="w-6 h-6 mr-3 text-purple-600" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.isAdmin ? "Administrator" : "Standard User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <KeyIcon className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCardIcon className="w-6 h-6 mr-3 text-purple-600" />
              Subscription Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-medium text-gray-900">
                    {getSubscriptionStatus()}
                  </p>
                </div>
              </div>

              {user.subscription?.currentPeriodEnd && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Next Billing Date</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(
                        user.subscription.currentPeriodEnd
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {user.subscription?.trialEnd &&
                getSubscriptionState() === "trial" && (
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">Trial Ends</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(
                          user.subscription.trialEnd
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onPasswordChange={handleChangePassword}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancellation}
        isLoading={isCanceling}
      />
    </div>
  );
}
