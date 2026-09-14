import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

function OrderTable({ orders }) {
  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        message="Orders placed against your store will appear here."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-700">
                #{String(order._id).slice(-6).toUpperCase()}
              </td>
              <td className="px-4 py-3">{order.customerName || "—"}</td>
              <td className="px-4 py-3">{order.items?.length ?? 0}</td>
              <td className="px-4 py-3 font-medium">
                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN")
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;