import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

function normalizeName(name = "") {
  return name.trim().toLowerCase();
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const incomingItems = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      incomingItems.forEach((item) => {
        const existing = state.items.find(
          (cartItem) => normalizeName(cartItem.name) === normalizeName(item.name)
        );

        if (existing) {
          existing.quantity += item.quantity || 1;
        } else {
          state.items.push({
            id: item.id || `${item.name}-${Date.now()}-${Math.random()}`,
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || "item",
          });
        }
      });
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;