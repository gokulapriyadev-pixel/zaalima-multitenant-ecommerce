import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Products', to: '/products' },
  { label: 'Orders', to: '/orders' },
  { label: 'Coupons', to: '/coupons' },
  { label: 'Store Settings', to: '/settings' },
];

function Sidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorInfo');
    navigate('/login');
  };

  let vendorName = 'Vendor Portal';
  try {
    const info = JSON.parse(localStorage.getItem('vendorInfo') || '{}');
    if (info.name) vendorName = info.name;
  } catch (e) {
    // ignore
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
            Vendor Dashboard
          </span>
          <h1 className="text-lg font-bold text-gray-900 truncate mt-0.5">
            {vendorName}
          </h1>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive || (activePage && item.to.includes(activePage))
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;