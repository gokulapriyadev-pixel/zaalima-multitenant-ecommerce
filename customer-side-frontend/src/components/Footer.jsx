import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#B8892B]/15 bg-[#0B1F1C]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="font-serif text-xl text-[#FAFAF7]">Zaalima</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#C7D3CE]">
              Discover products from multiple stores and enjoy a simple
              shopping experience in one place.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAF7]">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#C7D3CE]">
              <li>
                <Link to="/stores" className="transition hover:text-[#D9B968]">
                  Stores
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition hover:text-[#D9B968]">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-[#D9B968]">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAF7]">Account</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#C7D3CE]">
              <li>
                <Link to="/login" className="transition hover:text-[#D9B968]">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-[#D9B968]">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-[#D9B968]">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAF7]">Support</h3>
            <p className="mt-4 text-sm leading-6 text-[#C7D3CE]">
              Need help with your order or account? Contact our support
              team.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-white/40">
            © {new Date().getFullYear()} Zaalima. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;