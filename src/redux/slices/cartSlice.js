// slices/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        i => i.id === item.id && i.selectedSize === item.selectedSize
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      state.items = state.items.filter(
        i => !(i.id === item.id && i.selectedSize === item.selectedSize)
      );
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
