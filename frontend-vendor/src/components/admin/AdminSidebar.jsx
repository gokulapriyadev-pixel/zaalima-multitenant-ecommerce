import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { 
    label: 'Overview & Analytics', 
    to: '/admin/dashboard',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    label: 'Stores Moderation', 
    to: '/admin/stores',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    label: 'Users Directory', 
    to: '/admin/users',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    label: 'Global Orders', 
    to: '/admin/orders',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
];

function AdminSidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorInfo');
    navigate('/login');
  };

  let adminName = 'Super Admin';
  let adminEmail = 'admin@zaalima.com';
  try {
    const info = JSON.parse(localStorage.getItem('vendorInfo') || '{}');
    if (info.name) adminName = info.name;
    if (info.email) adminEmail = info.email;
  } catch (e) {
    // ignore
  }

  const initial = adminName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
            Super Admin Portal
          </span>
          <h1 className="text-lg font-bold text-gray-900 truncate mt-0.5">
            Zaalima Marketplace
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Platform Management
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center w-full px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive || (activePage && item.to.includes(activePage))
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
            {initial}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
              {adminName}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {adminEmail}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
