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

function App() {


  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/stores" element={<Stores />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
