function Navbar({ vendorName = 'Priya\'s Store' }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{vendorName}</h1>

      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-500 hover:text-gray-700">
          Notifications
        </button>
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {vendorName.charAt(0)}
        </div>
      </div>
    </header>
  );
}

export default Navbar;