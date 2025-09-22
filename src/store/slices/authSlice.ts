import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

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
