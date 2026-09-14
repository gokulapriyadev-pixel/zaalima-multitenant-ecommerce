import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("vendorToken");

  let isSuperAdmin = false;
  let isVendor = false;

  try {
    const info = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
    isSuperAdmin = info.role === "super_admin" || info.role === "superadmin";
    isVendor = info.role === "vendor";
  } catch {
    // ignore parse errors
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a regular vendor tries to access super admin routes, redirect to vendor dashboard
  if (!isSuperAdmin) {
    if (isVendor) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default AdminProtectedRoute;
