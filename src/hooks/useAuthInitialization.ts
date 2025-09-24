import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth, login } from "../store/slices/authSlice";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

export function useAuthInitialization() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check both localStorage and sessionStorage for auth token
        const localToken = localStorage.getItem("authToken");
        const sessionToken = sessionStorage.getItem("authToken");
        const oldToken = localToken || sessionToken;

        console.log("Auth initialization - Token found:", !!oldToken);
        console.log("Local token:", !!localToken);
        console.log("Session token:", !!sessionToken);

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

          console.log("Dispatching user data:", userData);
          dispatch(setUser(userData));
          dispatch(login());
          console.log("Auth initialization completed successfully");
          setIsInitializing(false);
        } else {
          // No token found, try to restore from localStorage
          console.log("No token found, checking for saved user data");
          const savedUserData = localStorage.getItem("userData");
          if (savedUserData) {
            try {
              const userData = JSON.parse(savedUserData);
              console.log(
                "User data found but no token - clearing user data to prevent inconsistent state"
              );
              // Clear user data since there's no token to authenticate API calls
              localStorage.removeItem("userData");
              dispatch(
                setUser({
                  id: "",
                  name: "",
                  email: "",
                  cardnumber: "",
                  avatar: "",
                  isAdmin: false,
                  subscription: null,
                })
              );
              setIsInitializing(false);
            } catch (parseError) {
              console.log("Could not parse saved user data:", parseError);
              localStorage.removeItem("userData");
              setIsInitializing(false);
            }
          } else {
            console.log("No saved user data found");
            setIsInitializing(false);
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
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return { isInitializing };
}
