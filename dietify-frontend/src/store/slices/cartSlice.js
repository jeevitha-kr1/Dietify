import { createSlice } from "@reduxjs/toolkit";

// Helper function to merge ingredients with the same name
function mergeCartItems(existingItems, newItems) {
  const mergedMap = new Map();

  // Put existing items into map
  existingItems.forEach((item) => {
    mergedMap.set(item.name.toLowerCase(), { ...item });
  });

  // Merge incoming items
  newItems.forEach((item) => {
    const key = item.name.toLowerCase();

    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);

      mergedMap.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      mergedMap.set(key, { ...item });
    }
  });

  return Array.from(mergedMap.values());
}

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items = mergeCartItems(state.items, action.payload);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item.name !== action.payload
      );
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;