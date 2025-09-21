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
        const oldToken = localStorage.getItem("authToken");

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
          localStorage.setItem("authToken", token);
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
        localStorage.removeItem("authToken");
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}
