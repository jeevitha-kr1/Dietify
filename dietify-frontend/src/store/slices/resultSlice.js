import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bmi: 0,
  bmiCategory: "",
  calories: 0,
  macros: {
    protein: 0,
    carbs: 0,
    fats: 0
  }
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {

    // Store calculated metrics
    setResults(state, action) {
      state.bmi = action.payload.bmi;
      state.bmiCategory = action.payload.bmiCategory;
      state.calories = action.payload.calories;
      state.macros = action.payload.macros;
    },

    // Reset results
    clearResults() {
      return initialState;
    }

  }
});

export const { setResults, clearResults } = resultSlice.actions;

export default resultSlice.reducer;