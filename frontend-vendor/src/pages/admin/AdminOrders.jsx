import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await api.get('/admin/orders', { params });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.message || 'Could not load global orders log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            Pending
          </span>
        );
    }
  };

  return (
    <AdminLayout
      activePage="orders"
      title="Global Orders Stream"
      subtitle="Cross-platform oversight of transactions, fulfillments, and order statuses."
    >
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by Order ID, customer, or store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
          {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                statusFilter === st 
                  ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchOrders} className="text-xs font-semibold underline hover:text-red-900">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading marketplace orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          <p className="text-base font-semibold text-gray-800">No orders found</p>
          <p className="text-xs mt-1 text-gray-400">Try adjusting your search criteria or status filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Order Identifier</th>
                  <th className="px-6 py-3.5 font-semibold">Customer</th>
                  <th className="px-6 py-3.5 font-semibold">Merchant Store</th>
                  <th className="px-6 py-3.5 font-semibold">Total Amount</th>
                  <th className="px-6 py-3.5 font-semibold">Payment Status</th>
                  <th className="px-6 py-3.5 font-semibold">Fulfillment</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID & Date */}
                    <td className="px-6 py-4">
                      <div className="font-mono text-blue-600 font-semibold text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {order.customerId?.name || 'Guest User'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {order.customerId?.email || 'N/A'}
                      </div>
                    </td>

                    {/* Store Info */}
                    <td className="px-6 py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {order.storeId?.name || 'General Store'}
                      </div>
                      <div className="text-xs text-blue-600 font-mono mt-0.5">
                        /{order.storeId?.slug || ''}
                      </div>
                    </td>

                    {/* Amount & Items count */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        ₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {order.orderItems?.length || 0} items
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>

                    {/* Details Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>Showing {orders.length} orders platform-wide</span>
            <span>Marketplace Order Oversight</span>
          </div>
        </div>
      )}

      {/* Order Details Audit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Order Audit</h3>
                <p className="text-xs font-mono text-blue-600 mt-0.5">#{selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-500 block">Customer</span>
                <span className="font-semibold text-gray-900">{selectedOrder.customerId?.name || 'Guest'}</span>
                <span className="block text-gray-400">{selectedOrder.customerId?.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Merchant Store</span>
                <span className="font-semibold text-gray-900">{selectedOrder.storeId?.name}</span>
                <span className="block text-blue-600 font-mono">/{selectedOrder.storeId?.slug}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Payment Method</span>
                <span className="font-semibold text-gray-900 uppercase">{selectedOrder.paymentMethod || 'COD'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Order Status</span>
                <div className="mt-0.5">{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Purchased Items ({selectedOrder.orderItems?.length || 0})
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Item</th>
                      <th className="px-4 py-2 font-semibold text-center">Qty</th>
                      <th className="px-4 py-2 font-semibold text-right">Price</th>
                      <th className="px-4 py-2 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800">
                          <div className="font-medium">{item.name}</div>
                          {item.variant && (
                            <div className="text-[10px] text-gray-400">{item.variant}</div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-600">{item.qty || item.quantity}</td>
                        <td className="px-4 py-2 text-right text-gray-600">₹{Number(item.price || 0).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">
                          ₹{(Number(item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Details */}
            {selectedOrder.shippingAddress && (
              <div className="text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-gray-500 block font-semibold mb-1">Shipping Address</span>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                </p>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
              <span className="text-gray-500">Gross Total Amount</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;
