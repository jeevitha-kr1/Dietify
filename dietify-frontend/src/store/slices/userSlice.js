import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    // Save questionnaire answers
    setUserProfile(state, action) {
      state.profile = action.payload;
    },

    // Clear profile if user logs out
    clearUserProfile(state) {
      state.profile = {};
    }

  }
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;