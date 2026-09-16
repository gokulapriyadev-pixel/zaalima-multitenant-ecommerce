import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StoreLayout from "./components/StoreLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";

import Scrolltop from "./components/ScrollTop";

function App() {
  return (
    <BrowserRouter>
      <Scrolltop />

      <Routes>
        {/* =====================================
            CUSTOMER STORE (PUBLIC)
        ===================================== */}
        <Route element={<StoreLayout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* All Stores */}
          <Route path="/stores" element={<Stores />} />

          {/* Single Store */}
          <Route path="/stores/:slug" element={<StoreDetails />} />

          {/* All Products */}
          <Route path="/products" element={<Products />} />

          {/* Single Product */}
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* =====================================
              PROTECTED CUSTOMER ROUTES
          ===================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Route>
        </Route>

        {/* =====================================
            AUTH (PUBLIC)
        ===================================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;