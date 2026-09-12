function Navbar({ vendorName }) {
  let displayName = vendorName;
  if (!displayName) {
    try {
      const info = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
      if (info.name) displayName = info.name;
    } catch (e) {
      // ignore
    }
  }
  if (!displayName) displayName = "Vendor Store";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{displayName}</h1>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{displayName}</span>
      </div>
    </header>
  );
}

export default Navbar;