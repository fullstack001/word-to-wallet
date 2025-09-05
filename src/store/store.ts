import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import flowSlice from "./slices/flowSlice"; // Import the new file slice
import userReducer from "./slices/userSlice"; // Import the user slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowSlice, // Add the file slice to the store
    user: userReducer, // Add the user slice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>; // Ensure RootState includes auth, file, and user slices
export type AppDispatch = typeof store.dispatch;
