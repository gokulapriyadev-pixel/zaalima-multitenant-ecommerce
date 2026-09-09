import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Regiser";

import StoreLayout from "./components/StoreLayout";

import Home from "./pages/Home";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import Analytics from "./pages/Analytics";

import Scrolltop from "./components/ScrollTop";

function App() {
  return (
    <BrowserRouter>
      <Scrolltop />

      <Routes>
        {/* =====================================
            CUSTOMER STORE
        ===================================== */}

        <Route element={<StoreLayout />}>
          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* All Stores */}
          <Route
            path="/stores"
            element={<Stores />}
          />

          {/* Single Store */}
          <Route
            path="/stores/:slug"
            element={<StoreDetails />}
          />

          {/* All Products */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* Single Product */}
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* Cart */}
          <Route
            path="/cart"
            element={<Cart />}
          />

         <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={<Checkout />}
          />
        </Route>

        {/* =====================================
            AUTH
        ===================================== */}

        {/* Login */}
        
        <Route
            path="/analytics"
            element={<Analytics />}
          />
        
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;