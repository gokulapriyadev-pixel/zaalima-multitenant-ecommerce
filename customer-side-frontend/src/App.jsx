import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Regiser'
import Footer from './components/Footer'
import StoreLayout from './components/StoreLayout'
import Stores from './pages/Stores'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Scrolltop from './components/ScrollTop'
import Cart from './pages/Cart'

function App() {


  return (
    <>
      <BrowserRouter>
<Scrolltop />
        <Routes>

          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/products" element={<Products />} />
            <Route path= "/products/:id" element = {<ProductDetails />} />
            <Route path= "/cart" element = {<Cart />} />

{/* <Route element={<ProtectedRoute />}>
<Route path="/checkout" element={<Checkout />} />
</Route> */}

          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
