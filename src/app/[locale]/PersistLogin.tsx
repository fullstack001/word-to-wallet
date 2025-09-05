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
          const response = await axios.get(
            "https://api.wordtowallet.com/api/auth/validate-token",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oldToken}`,
              },
            }
          );

          const { token, user, subscription } = response.data;
          localStorage.setItem("authToken", token);
          dispatch(
            setUser({
              ...user,
              cardnumber: user.cardnumber || "", // Ensure cardnumber is included
              subscription,
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
