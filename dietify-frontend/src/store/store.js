
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import resultReducer from "./slices/resultSlice";
import cartReducer from "./slices/cartSlice";
import aiReducer from "./slices/aiSlice";

export const store = configureStore({
  reducer: {

    // User questionnaire answers
    user: userReducer,

    // Calculated metrics (BMI, calories, macros)
    result: resultReducer,

    // Ingredient cart
    cart: cartReducer,

    // AI generated meal plan and recipes
    ai: aiReducer,
  },
  devTools: true,
});