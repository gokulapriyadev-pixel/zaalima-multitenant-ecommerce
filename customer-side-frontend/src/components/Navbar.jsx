import { ShoppingCart } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectIsAuthenticated,
  selectUser,
} from "../redux/authSlice";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Stores", to: "/stores" },
  { label: "Products", to: "/products" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const navLinkClasses = ({ isActive }) =>
    `relative pb-1 text-sm font-medium transition ${
      isActive
        ? "text-[#14201C] font-semibold after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-[#B8892B]"
        : "text-[#6B6F6D] hover:text-[#14201C]"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E1D9] bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl tracking-tight text-[#0F2C27]"
        >
          Zaalima
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={navLinkClasses}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated &&
          ["vendor", "super_admin"].includes(user?.role) && (
          <NavLink
              to="/analytics"
              className={navLinkClasses}
        >       
          Analytics
          </NavLink>
        )}


        </div>
      

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-[#14201C] transition hover:bg-[#0F2C27]/5"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} strokeWidth={1.75} />
          </Link>

          {!isAuthenticated ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hidden text-sm font-medium text-[#6B6F6D] transition hover:text-[#14201C] sm:block"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg bg-[#0F2C27] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#123832]"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* User */}
              <span className="hidden text-sm font-medium text-[#14201C] sm:block">
                Hi, {user?.name || "Customer"}
              </span>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-[#0F2C27] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#123832]"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;