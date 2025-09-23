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

// Initialize user state from localStorage if available
const getInitialUserState = (): UserState => {
  if (typeof window !== "undefined") {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      try {
        return JSON.parse(savedUserData);
      } catch (error) {
        console.log("Could not parse saved user data:", error);
        localStorage.removeItem("userData");
      }
    }
  }
  return {
    id: "",
    name: "", // Initialize name
    email: "",
    cardnumber: "", // Initialize cardnumber
    avatar: "",
    isAdmin: false,
    subscription: null,
  };
};

const initialState: UserState = getInitialUserState();

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
