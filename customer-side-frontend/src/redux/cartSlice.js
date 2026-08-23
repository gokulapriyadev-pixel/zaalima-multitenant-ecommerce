import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
   
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {                                

        addToCart: (state, action) => {            //state = current state, action = payload
            const quantityToAdd = action.payload.quantity ?? 1; // Default to 1 if quantity is not provided

            const existingItem = state.cartItems.find(item => item.id === action.payload.id);

            if (existingItem) {
                existingItem.quantity += quantityToAdd;
            }
            else {
                state.cartItems.push({
                    ...action.payload,
                    quantity: quantityToAdd
                })
            }
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload.id
            )
        },

        clearCart: (state) => {
            state.cartItems = [];
        },

        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                (item) => item.id === action.payload.id
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                (item) => item.id === action.payload.id 
            )

            if(item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },

    }
})


export const {
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity
} = cartSlice.actions;

//Selectors - Redux Store se specific data nikalna/read karna.

//cart is coming from store.js - state.cart.cartItems

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotalItems = (state) => 
    state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
   
export const selectCartTotalPrice = (state) =>
    state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;