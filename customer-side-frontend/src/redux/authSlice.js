import { createSlice } from "@reduxjs/toolkit";

let savedUser = null;
let savedToken = null;
try {
  savedToken = localStorage.getItem("customerToken");
  const userStr = localStorage.getItem("customerInfo");
  if (userStr) {
    savedUser = JSON.parse(userStr);
  }
} catch (e) {
  console.warn("Failed to load customer auth from storage", e);
}

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        if (action.payload.token) {
          localStorage.setItem("customerToken", action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem("customerInfo", JSON.stringify(action.payload.user));
        }
      } catch (e) {
        console.warn("Failed to persist customer auth", e);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customerInfo");
      } catch (e) {
        console.warn("Failed to clear customer auth", e);
      }
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;