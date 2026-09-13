function TopBar({ title = "Store Overview" }) {
  let vendorName = "Vendor";
  try {
    const info = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
    if (info.name) vendorName = info.name;
  } catch (e) {
    // ignore
  }

  const initial = vendorName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
          {initial}
        </div>
        <span className="text-sm font-medium text-gray-700">{vendorName}</span>
      </div>
    </div>
  );
}

export default TopBar;