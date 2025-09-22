import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string; // Add name to UserState
  email: string;
  cardnumber: string; // Add cardnumber to UserState
  avatar: string;
  isAdmin: boolean;
  subscription: {
    subscriptionId: string;
    plan: string;
    subscriptionType: string;
    subscribedDate: string;
    expiryDate: string;
    status?: string;
    trialStart?: string;
    trialEnd?: string;
  } | null;
}

const initialState: UserState = {
  id: "",
  name: "", // Initialize name
  email: "",
  cardnumber: "", // Initialize cardnumber
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
    },
    clearUser(state) {
      state.id = "";
      state.name = ""; // Clear name
      state.email = "";
      state.cardnumber = ""; // Clear cardnumber
      state.avatar = "";
      state.isAdmin = false;
      state.subscription = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
