import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <nav className="flex gap-6">
          <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
            Login
          </Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
            Register
          </Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
            Dashboard
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;