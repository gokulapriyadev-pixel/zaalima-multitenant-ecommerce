import { Link } from "react-router-dom";

const SHOP_LINKS = [
  { label: "Stores", to: "/stores" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
];

const ACCOUNT_LINKS = [
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "My Orders", to: "/orders" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-gray-600">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="transition hover:text-[#0F2C27]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Zaalima</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
              Discover products from multiple stores and enjoy a simple
              shopping experience in one place.
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Account" links={ACCOUNT_LINKS} />

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Need help with your order or account? Contact our support
              team.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Zaalima. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;