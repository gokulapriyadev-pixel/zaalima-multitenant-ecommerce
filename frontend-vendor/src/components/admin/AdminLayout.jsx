import AdminSidebar from './AdminSidebar';

function AdminLayout({ children, activePage, title, subtitle }) {
  let adminName = 'Super Admin';
  try {
    const info = JSON.parse(localStorage.getItem('vendorInfo') || '{}');
    if (info.name) adminName = info.name;
  } catch (e) {
    // ignore
  }
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Super Admin Sidebar */}
      <AdminSidebar activePage={activePage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header (Matches Vendor TopBar style) */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
                {title || 'Platform Overview'}
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                Super Admin
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Platform Core Online</span>
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                {initial}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {adminName}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
