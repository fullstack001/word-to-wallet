"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { login } from "@/store/slices/authSlice";
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
          const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${oldToken}`,
            },
          });

          // Extract data from the backend response structure
          const { data } = response.data;
          const { user } = data;

          // Transform to match frontend expected structure
          const token = oldToken; // Use the existing token
          const transformedUser = {
            id: user.id,
            email: user.email,
            name: user.fullName,
            cardnumber: "", // Not provided by backend
            avatar: "", // Not provided by backend
            isAdmin: user.role === "admin",
          };
          const subscription = undefined; // Not provided by profile endpoint

          // Store token in the same storage type it was found in
          if (localToken) {
            localStorage.setItem("authToken", token);
          } else if (sessionToken) {
            sessionStorage.setItem("authToken", token);
          }

          dispatch(
            setUser({
              ...transformedUser,
              subscription: subscription || null,
            })
          );
          dispatch(login());
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Clear both storage types on error
        localStorage.removeItem("authToken");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
        sessionStorage.removeItem("authToken");
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}
