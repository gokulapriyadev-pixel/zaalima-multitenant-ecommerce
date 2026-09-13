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

const loadCouponFromStorage = () => {
  try {
    const saved = localStorage.getItem("customerCoupon");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load coupon from localStorage", e);
  }
  return null;
};

const saveCouponToStorage = (coupon) => {
  try {
    if (coupon) {
      localStorage.setItem("customerCoupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("customerCoupon");
    }
  } catch (e) {
    console.warn("Failed to persist coupon to localStorage", e);
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
  appliedCoupon: loadCouponFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload.id || action.payload._id;
      const quantityToAdd = action.payload.quantity ?? 1;
      const itemStock = action.payload.stock !== undefined ? Number(action.payload.stock) : Infinity;
      const incomingStoreId = action.payload.storeId;
      const incomingStoreName = action.payload.storeName || "New Store";

      // Abort if item is out of stock
      if (itemStock <= 0) {
        return;
      }

      // Multi-Store Cart Isolation Check
      if (state.cartItems.length > 0 && incomingStoreId) {
        const existingStoreId = state.cartItems[0].storeId;
        const existingStoreName = state.cartItems[0].storeName || "Previous Store";

        if (existingStoreId && String(existingStoreId) !== String(incomingStoreId)) {
          if (typeof window !== "undefined") {
            const confirmed = window.confirm(
              `Your cart contains items from ${existingStoreName}. Clear cart to add items from ${incomingStoreName}?`
            );
            if (!confirmed) {
              return; // User cancelled, keep existing cart
            }
          }
          // Clear cart and existing coupon if switching stores
          state.cartItems = [];
          state.appliedCoupon = null;
          saveCouponToStorage(null);
        }
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
          storeId: incomingStoreId,
          storeName: incomingStoreName,
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
      if (state.cartItems.length === 0) {
        state.appliedCoupon = null;
        saveCouponToStorage(null);
      }
      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.appliedCoupon = null;
      saveCartToStorage([]);
      saveCouponToStorage(null);
    },

    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      saveCouponToStorage(action.payload);
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      saveCouponToStorage(null);
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
  applyCoupon,
  removeCoupon,
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

export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;

export const selectDiscountAmount = (state) => {
  const coupon = state.cart.appliedCoupon;
  if (!coupon) return 0;
  const subtotal = selectCartTotalPrice(state);
  if (coupon.discountType === "percentage") {
    return Math.round(subtotal * (Number(coupon.discountValue) / 100));
  } else if (coupon.discountType === "fixed") {
    return Math.min(subtotal, Number(coupon.discountValue));
  }
  return 0;
};

export const selectFinalTotalPrice = (state) => {
  const subtotal = selectCartTotalPrice(state);
  const discount = selectDiscountAmount(state);
  return Math.max(0, subtotal - discount);
};

export const selectCartStore = (state) => {
  if (!state.cart.cartItems || state.cart.cartItems.length === 0) return null;
  const firstItem = state.cart.cartItems[0];
  return {
    storeId: firstItem.storeId,
    storeName: firstItem.storeName || "Store",
  };
};

export default cartSlice.reducer;