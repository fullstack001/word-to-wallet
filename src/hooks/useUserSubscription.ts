"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { getCurrentUser } from "../utils/apiUtils";
import { RootState } from "../store/store";

export const useUserSubscription = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const fetchUserData = async () => {
    try {
      const authData = await getCurrentUser();

      // Update Redux state with fresh user data including subscription
      dispatch(
        setUser({
          id: authData.user.id,
          name: authData.user.name || "",
          email: authData.user.email,
          cardnumber: authData.user.cardnumber || "",
          avatar: authData.user.avatar || "",
          isAdmin: authData.user.isAdmin,
          subscription: authData.subscription
            ? {
                stripeCustomerId: authData.subscription.stripeCustomerId,
                stripeSubscriptionId:
                  authData.subscription.stripeSubscriptionId,
                status: authData.subscription.status,
                plan: authData.subscription.plan,
                trialStart: authData.subscription.trialStart,
                trialEnd: authData.subscription.trialEnd,
                currentPeriodStart: authData.subscription.currentPeriodStart,
                currentPeriodEnd: authData.subscription.currentPeriodEnd,
                cancelAtPeriodEnd: authData.subscription.cancelAtPeriodEnd,
                canceledAt: authData.subscription.canceledAt,
              }
            : null,
        })
      );
    } catch (error) {
      console.error("Failed to fetch user subscription data:", error);
    }
  };

  // Fetch user data when component mounts and user is logged in
  useEffect(() => {
    if (isLoggedIn && user.id) {
      fetchUserData();
    }
  }, [isLoggedIn, user.id]);

  return {
    fetchUserData,
    user,
    isLoggedIn,
  };
};
