import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Zaalima
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/stores"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Stores
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Products
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-black"
            aria-label="Shopping cart"
          >
            🛒
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="hidden text-sm font-medium text-gray-700 transition hover:text-black sm:block"
          >
            Login
          </Link>

          {/* Register */}
          <Link
            to="/register"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Register
          </Link>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;