import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
}

// Initialize auth state from localStorage if available
const getInitialAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("authToken");
    const sessionToken = sessionStorage.getItem("authToken");
    return {
      isLoggedIn: !!(localToken || sessionToken),
    };
  }
  return {
    isLoggedIn: false,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    initializeAuth(state) {
      // Check both localStorage and sessionStorage for auth token
      const localToken = localStorage.getItem("authToken");
      const sessionToken = sessionStorage.getItem("authToken");
      state.isLoggedIn = !!(localToken || sessionToken);
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
