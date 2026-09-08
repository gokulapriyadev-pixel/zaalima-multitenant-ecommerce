function TopBar() {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-800">Store Overview</h1>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
          N
        </div>
        <span className="text-sm text-gray-600">Nilav</span>
      </div>
    </div>
  );
}

export default TopBar;