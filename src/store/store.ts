import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice"; // Import the user slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Add the user slice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>; // Ensure RootState includes auth, file, and user slices
export type AppDispatch = typeof store.dispatch;
