import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  summary: "",
  mealPlan: [],
  recipes: [],
  tips: []
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {

    setAiLoading(state, action) {
      state.loading = action.payload;
    },

    setAiData(state, action) {
      state.summary = action.payload.summary;
      state.mealPlan = action.payload.mealPlan;
      state.recipes = action.payload.recipes;
      state.tips = action.payload.tips;
    },

    clearAiData() {
      return initialState;
    }

  }
});

export const { setAiLoading, setAiData, clearAiData } = aiSlice.actions;

export default aiSlice.reducer;