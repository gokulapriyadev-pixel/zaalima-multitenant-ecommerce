import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OverviewCard from '../components/OverviewCard';
import api from '../services/api';

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    storeName: '',
    totalOrders: 0,
    totalRevenue: 0,
    lowInventoryItems: 0,
    lowInventoryProducts: [],
  });
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Fetch store analytics
        const analyticsRes = await api.get('/orders/analytics/my-store');
        setAnalytics(analyticsRes.data);

        // 2. Fetch vendor products count
        try {
          const prodRes = await api.get('/products');
          setProductsCount(prodRes.data.products?.length ?? prodRes.data.count ?? 0);
        } catch (prodErr) {
          console.warn("Could not fetch product list:", prodErr);
        }
      } catch (err) {
        console.error("Dashboard analytics error:", err);
        setError(err.response?.data?.message || 'Could not load store analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar vendorName={analytics.storeName} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {analytics.storeName ? `${analytics.storeName} Overview` : 'Store Overview'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Real-time performance metrics and store inventory status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                + Manage Products
              </Link>
              <Link
                to="/orders"
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                View Orders
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex justify-between items-center">
              <span>{error}</span>
              <Link to="/settings" className="underline font-semibold ml-2">
                Configure Store
              </Link>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading store analytics...</div>
          ) : (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <OverviewCard
                  title="Total Products"
                  value={String(productsCount)}
                  trend="Live catalog items"
                />
                <OverviewCard
                  title="Total Orders"
                  value={String(analytics.totalOrders || 0)}
                  trend="Customer orders"
                />
                <OverviewCard
                  title="Revenue"
                  value={`₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}`}
                  trend="Gross sales"
                />
                <OverviewCard
                  title="Low Stock Items"
                  value={String(analytics.lowInventoryItems || 0)}
                  trend={analytics.lowInventoryItems > 0 ? "Needs restock (< 5 units)" : "All stocked"}
                />
              </div>

              {/* Low Inventory Section */}
              {analytics.lowInventoryProducts && analytics.lowInventoryProducts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 text-red-600 flex items-center gap-2">
                    ⚠️ Low Inventory Alerts
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {analytics.lowInventoryProducts.map((p) => (
                      <div key={p._id} className="py-3 flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-800">{p.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">₹{p.price}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            {p.inventoryCount} left in stock
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;