import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalStores: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [stores, setStores] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch platform analytics
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data);

      // 2. Fetch stores for active/suspended breakdown & recent table
      try {
        const storesRes = await api.get('/admin/stores');
        setStores(storesRes.data || []);
      } catch (err) {
        console.warn("Could not fetch stores:", err);
      }

      // 3. Fetch recent global orders
      try {
        const ordersRes = await api.get('/admin/orders');
        setRecentOrders((ordersRes.data?.orders || []).slice(0, 5));
      } catch (err) {
        console.warn("Could not fetch orders:", err);
      }

    } catch (err) {
      console.error("Admin dashboard fetch failed:", err);
      setError(err.response?.data?.message || 'Failed to load platform analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeStoresCount = stores.filter(s => s.isActive).length;
  const suspendedStoresCount = stores.length - activeStoresCount;
  const customersCount = Math.max(0, analytics.totalUsers - analytics.totalVendors);

  return (
    <AdminLayout
      activePage="dashboard"
      title="Platform Overview"
      subtitle="Complete bird's-eye metrics across all stores, merchants, and orders."
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={fetchDashboardData}
            className="text-xs font-semibold underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading platform metrics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1: Platform Gross Revenue */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Gross Platform Revenue
                </span>
                <span className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  ₹{Number(analytics.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Aggregated across all store checkouts</p>
              </div>
            </div>

            {/* Metric 2: Total Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Global Orders
                </span>
                <span className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analytics.totalOrders}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Total orders processed platform-wide</p>
              </div>
            </div>

            {/* Metric 3: Active Stores */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Marketplace Stores
                </span>
                <span className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analytics.totalStores}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-emerald-600 font-semibold">{activeStoresCount} Active</span>
                  {' • '}
                  <span className="text-red-600 font-semibold">{suspendedStoresCount} Suspended</span>
                </p>
              </div>
            </div>

            {/* Metric 4: Platform Users */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Registered Users
                </span>
                <span className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {analytics.totalUsers}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-amber-600 font-semibold">{analytics.totalVendors} Vendors</span>
                  {' • '}
                  <span className="text-blue-600 font-semibold">{customersCount} Customers</span>
                </p>
              </div>
            </div>
          </div>

          {/* Platform Status & Store Moderation Quick View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Health Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Store Network Health
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Active vs suspended merchant tenant status
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-emerald-700 font-semibold">Active Stores ({activeStoresCount})</span>
                      <span className="text-gray-600">
                        {stores.length > 0 ? Math.round((activeStoresCount / stores.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${stores.length > 0 ? (activeStoresCount / stores.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-red-700 font-semibold">Suspended Stores ({suspendedStoresCount})</span>
                      <span className="text-gray-600">
                        {stores.length > 0 ? Math.round((suspendedStoresCount / stores.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${stores.length > 0 ? (suspendedStoresCount / stores.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  to="/admin/stores"
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Manage All Stores in Moderation Panel →
                </Link>
              </div>
            </div>

            {/* Quick Actions & Recent Stores */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    Recently Registered Stores
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Latest merchant store additions across Zaalima
                  </p>
                </div>
                <Link 
                  to="/admin/stores"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View all ({stores.length})
                </Link>
              </div>

              {stores.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No stores registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] bg-gray-50/50">
                        <th className="py-2.5 px-3 font-semibold">Store</th>
                        <th className="py-2.5 px-3 font-semibold">Owner</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stores.slice(0, 4).map((s) => (
                        <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-gray-900">{s.name}</div>
                            <div className="text-[11px] text-gray-500">/{s.slug}</div>
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            <div className="font-medium">{s.ownerId?.name || 'Unknown'}</div>
                            <div className="text-[11px] text-gray-400">{s.ownerId?.email || ''}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              s.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {s.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to="/admin/stores"
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Global Orders Stream */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Recent Global Orders
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest customer purchases recorded on the marketplace
                </p>
              </div>
              <Link 
                to="/admin/orders"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View full order log →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No orders recorded on platform yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] bg-gray-50/50">
                      <th className="py-2.5 px-3 font-semibold">Order ID</th>
                      <th className="py-2.5 px-3 font-semibold">Customer</th>
                      <th className="py-2.5 px-3 font-semibold">Store</th>
                      <th className="py-2.5 px-3 font-semibold">Amount</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-gray-700">
                          #{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-3 text-gray-900 font-medium">
                          {ord.customerId?.name || 'Guest User'}
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          {ord.storeId?.name || 'General Store'}
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-900">
                          ₹{Number(ord.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ord.orderStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
