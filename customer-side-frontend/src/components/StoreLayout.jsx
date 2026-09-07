import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


function StoreLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

export default StoreLayout;