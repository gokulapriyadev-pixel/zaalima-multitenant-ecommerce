import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("vendorToken");

  let isVendor = false;
  try {
    const info = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
    isVendor = info.role === "vendor" || info.role === "super_admin";
  } catch {
    // ignore parse errors
  }

  if (!token || !isVendor) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
