import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import api from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Get vendor's store
      const storeRes = await api.get('/stores/my-store');
      const currentStore = storeRes.data.store;
      setStore(currentStore);

      // 2. Get orders for this store
      if (currentStore?._id) {
        const ordersRes = await api.get(`/orders/store/${currentStore._id}`);
        setOrders(ordersRes.data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load store orders:", err);
      setError(err.response?.data?.message || 'Failed to load orders for your store.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="orders" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Store Order Fulfillment" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Customer Orders</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Review and update shipping progress for incoming customer purchases.
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              ↻ Refresh
            </button>
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-gray-500">Loading customer orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center text-gray-500">
              <p className="font-semibold text-gray-800 text-base">No orders received yet</p>
              <p className="text-sm text-gray-400 mt-1">
                When customers purchase your products, their orders will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Order ID / Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Items Summary</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      const formattedDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recent';

                      return (
                        <tr key={order._id} className="hover:bg-gray-50/60 transition">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-gray-800 block">
                              #{order._id.slice(-8)}
                            </span>
                            <span className="text-xs text-gray-400">{formattedDate}</span>
                          </td>

                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">
                              {order.customerId?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-gray-400">{order.customerId?.email}</p>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600 max-w-xs space-y-1">
                              {order.products?.map((p, idx) => (
                                <div key={idx} className="truncate">
                                  • {p.productId?.name || 'Product'} (x{p.quantity})
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="px-4 py-3 font-bold text-gray-900">
                            ₹{order.totalAmount?.toLocaleString('en-IN')}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.paymentStatus || 'pending'}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <select
                              value={order.orderStatus || 'processing'}
                              disabled={updatingId === order._id || order.orderStatus === 'cancelled'}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`border rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer transition ${getStatusBadge(
                                order.orderStatus
                              )}`}
                            >
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Orders;
