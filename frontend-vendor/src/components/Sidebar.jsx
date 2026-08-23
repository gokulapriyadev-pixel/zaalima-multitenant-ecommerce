import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Products', key: 'products' },
  { label: 'Orders', key: 'orders' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Settings', key: 'settings' },
];

function Sidebar({ activePage = 'dashboard', onNavigate }) {
  const [active, setActive] = useState(activePage);

  const handleClick = (key) => {
    setActive(key);
    if (onNavigate) onNavigate(key);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 text-xl font-bold text-blue-600 border-b border-gray-100">
        Zaalima Vendor
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === item.key
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;