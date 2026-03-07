import { createSlice } from "@reduxjs/toolkit";

// Initial authentication state
const initialState = {
  isLoggedIn: false,
  userEmail: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // When user logs in
    loginUser(state, action) {
      state.isLoggedIn = true;
      state.userEmail = action.payload;
    },

    // When user logs out
    logoutUser(state) {
      state.isLoggedIn = false;
      state.userEmail = null;
    }

  }
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;