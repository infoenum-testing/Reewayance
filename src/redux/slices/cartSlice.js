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
      // पहले चेक करो कि ये item size के साथ पहले से है या नहीं
      const existingIndex = state.items.findIndex(
        i => i.id === item.id && i.selectedSize === item.selectedSize
      );
      if (existingIndex >= 0) {
        // item है, quantity बढ़ाओ
        state.items[existingIndex].quantity += 1;
      } else {
        // नया item add करो quantity=1 के साथ
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
