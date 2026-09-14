import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders" },
  { label: "Pricing", path: "/pricing" },
  { label: "Settings", path: "/settings" },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-4 py-2 rounded-md ${
            pathname === item.path
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default Sidebar;