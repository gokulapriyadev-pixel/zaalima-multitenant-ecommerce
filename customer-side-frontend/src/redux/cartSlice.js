import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem("customerCart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
  }
  return [];
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("customerCart", JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to persist cart to localStorage", e);
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload.id || action.payload._id;
      const quantityToAdd = action.payload.quantity ?? 1;
      const itemStock = action.payload.stock !== undefined ? Number(action.payload.stock) : Infinity;

      // Abort if item is out of stock
      if (itemStock <= 0) {
        return;
      }

      const existingItem = state.cartItems.find(
        (item) => (item.id || item._id) === itemId
      );

      if (existingItem) {
        const currentStock = existingItem.stock !== undefined ? Number(existingItem.stock) : itemStock;
        existingItem.quantity = Math.min(currentStock, existingItem.quantity + quantityToAdd);
        existingItem.stock = currentStock;
      } else {
        state.cartItems.push({
          ...action.payload,
          id: itemId,
          _id: itemId,
          stock: itemStock,
          quantity: Math.min(itemStock, quantityToAdd),
        });
      }
      saveCartToStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const targetId = action.payload?.id || action.payload?._id || action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => (item.id || item._id) !== targetId
      );
      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      saveCartToStorage(state.cartItems);
    },

    increaseQuantity: (state, action) => {
      const targetId = action.payload?.id || action.payload?._id || action.payload;
      const item = state.cartItems.find(
        (item) => (item.id || item._id) === targetId
      );
      if (item) {
        const itemStock = item.stock !== undefined ? Number(item.stock) : Infinity;
        if (item.quantity < itemStock) {
          item.quantity += 1;
          saveCartToStorage(state.cartItems);
        }
      }
    },

    decreaseQuantity: (state, action) => {
      const targetId = action.payload?.id || action.payload?._id || action.payload;
      const item = state.cartItems.find(
        (item) => (item.id || item._id) === targetId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.cartItems);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotalItems = (state) =>
  state.cart.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

export const selectCartTotalPrice = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

export default cartSlice.reducer;