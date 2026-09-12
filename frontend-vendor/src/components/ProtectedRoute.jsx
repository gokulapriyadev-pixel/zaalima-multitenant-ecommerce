import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("vendorToken");

  let role = "";
  try {
    const info = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
    role = info.role;
  } catch {
    // ignore parse errors
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If super admin visits vendor route, redirect directly to admin dashboard
  if (role === "super_admin" || role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Only vendors are allowed on vendor routes
  if (role !== "vendor") {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
