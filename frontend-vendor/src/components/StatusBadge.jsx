const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-200 text-gray-700",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

function StatusBadge({ status }) {
  const key = String(status || "pending").toLowerCase();
  const style = STATUS_STYLES[key] || "bg-gray-100 text-gray-700";
  const label = key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
