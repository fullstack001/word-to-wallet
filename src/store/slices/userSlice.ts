import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  email: string;
  cardnumber: string;
  avatar: string;
  isAdmin: boolean;
  subscription: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status: string;
    plan: string;
    trialStart?: string;
    trialEnd?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: string;
  } | null;
}

// Initialize user state - always start with empty state to prevent hydration mismatch
const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  cardnumber: "",
  avatar: "",
  isAdmin: false,
  subscription: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.name = action.payload.name; // Set name
      state.email = action.payload.email;
      state.cardnumber = action.payload.cardnumber; // Set cardnumber
      state.avatar = action.payload.avatar;
      state.isAdmin = action.payload.isAdmin;
      state.subscription = action.payload.subscription;

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
    clearUser(state) {
      state.id = "";
      state.name = ""; // Clear name
      state.email = "";
      state.cardnumber = ""; // Clear cardnumber
      state.avatar = "";
      state.isAdmin = false;
      state.subscription = null;

      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("userData");
      }
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
