"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { login, initializeAuth } from "@/store/slices/authSlice";
import axios from "axios";

export default function PersistLogin() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check both localStorage and sessionStorage for auth token
        const localToken = localStorage.getItem("authToken");
        const sessionToken = sessionStorage.getItem("authToken");
        const oldToken = localToken || sessionToken;

        if (oldToken) {
          const API_BASE_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

          // First, try to get user profile
          const profileResponse = await axios.get(
            `${API_BASE_URL}/auth/profile`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oldToken}`,
              },
            }
          );

          // Extract user data from the backend response structure
          const { data } = profileResponse.data;
          const { user } = data;

          // Transform to match frontend expected structure
          const transformedUser = {
            id: user.id,
            email: user.email,
            name: user.fullName,
            cardnumber: "", // Not provided by backend
            avatar: "", // Not provided by backend
            isAdmin: user.role === "admin",
          };

          // Try to get subscription data from dashboard endpoint
          let subscription: any = null;
          try {
            const dashboardResponse = await axios.get(
              `${API_BASE_URL}/dashboard`,
              {
                headers: {
                  Authorization: `Bearer ${oldToken}`,
                },
              }
            );

            if (dashboardResponse.data?.data?.subscription) {
              subscription = {
                stripeCustomerId:
                  dashboardResponse.data.data.subscription.stripeCustomerId,
                stripeSubscriptionId:
                  dashboardResponse.data.data.subscription.stripeSubscriptionId,
                status: dashboardResponse.data.data.subscription.status,
                plan: dashboardResponse.data.data.subscription.plan,
                trialStart: dashboardResponse.data.data.subscription.trialStart,
                trialEnd: dashboardResponse.data.data.subscription.trialEnd,
                currentPeriodStart:
                  dashboardResponse.data.data.subscription.currentPeriodStart,
                currentPeriodEnd:
                  dashboardResponse.data.data.subscription.currentPeriodEnd,
                cancelAtPeriodEnd:
                  dashboardResponse.data.data.subscription.cancelAtPeriodEnd,
                canceledAt: dashboardResponse.data.data.subscription.canceledAt,
              };
            }
          } catch (subscriptionError) {
            console.log(
              "Could not fetch subscription data:",
              subscriptionError
            );
            // Continue without subscription data
          }

          // Store user and subscription data in localStorage for persistence
          const userData = {
            ...transformedUser,
            subscription: subscription,
          };

          localStorage.setItem("userData", JSON.stringify(userData));

          // Store token in the same storage type it was found in
          if (localToken) {
            localStorage.setItem("authToken", oldToken);
          } else if (sessionToken) {
            sessionStorage.setItem("authToken", oldToken);
          }

          dispatch(setUser(userData));
          dispatch(login());
        } else {
          // No token found, try to restore from localStorage
          const savedUserData = localStorage.getItem("userData");
          if (savedUserData) {
            try {
              const userData = JSON.parse(savedUserData);
              dispatch(setUser(userData));
              dispatch(login());
            } catch (parseError) {
              console.log("Could not parse saved user data:", parseError);
              localStorage.removeItem("userData");
            }
          }
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Clear both storage types on error
        localStorage.removeItem("authToken");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("authToken");
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}
