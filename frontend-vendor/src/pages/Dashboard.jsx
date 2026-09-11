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
    orderStatusBreakdown: {
      delivered: 0,
      shipped: 0,
      processing: 0,
      cancelled: 0,
    },
    salesTrend: [],
  });
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Fetch store analytics (includes salesTrend & orderStatusBreakdown)
        const analyticsRes = await api.get('/orders/analytics/my-store');
        setAnalytics(analyticsRes.data);

        // 2. Fetch vendor products count
        try {
          const prodRes = await api.get('/products');
          setProductsCount(prodRes.data.products?.length ?? prodRes.data.count ?? 0);
        } catch (prodErr) {
          console.warn('Could not fetch product list:', prodErr);
        }
      } catch (err) {
        console.error('Dashboard analytics error:', err);
        setError(err.response?.data?.message || 'Could not load store analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate highest revenue in the 7-day trend for scaling bar heights
  const trendData = analytics.salesTrend || [];
  const maxTrendRevenue = Math.max(...trendData.map((d) => d.revenue || 0), 1000);
  const weekTotalRevenue = trendData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const weekTotalOrders = trendData.reduce((acc, curr) => acc + (curr.orders || 0), 0);

  // Status breakdown calculations
  const breakdown = analytics.orderStatusBreakdown || {
    delivered: 0,
    shipped: 0,
    processing: 0,
    cancelled: 0,
  };
  const totalBreakdownOrders =
    (breakdown.delivered || 0) +
    (breakdown.shipped || 0) +
    (breakdown.processing || 0) +
    (breakdown.cancelled || 0);

  const getPercent = (count) => {
    if (!totalBreakdownOrders) return 0;
    return Math.round((count / totalBreakdownOrders) * 100);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar vendorName={analytics.storeName} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {analytics.storeName ? `${analytics.storeName} Overview` : 'Store Overview'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Real-time performance metrics, sales trends, and store inventory status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
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
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex justify-between items-center">
              <span>{error}</span>
              <Link to="/settings" className="underline font-semibold ml-2">
                Configure Store
              </Link>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-gray-500">Loading store analytics and charts...</div>
          ) : (
            <>
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard
                  title="Total Products"
                  value={String(productsCount)}
                  trend="Live catalog items"
                />
                <OverviewCard
                  title="Total Orders"
                  value={String(analytics.totalOrders || 0)}
                  trend="All-time orders"
                />
                <OverviewCard
                  title="Total Revenue"
                  value={`₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}`}
                  trend="Gross lifetime sales"
                />
                <OverviewCard
                  title="Low Stock Items"
                  value={String(analytics.lowInventoryItems || 0)}
                  trend={analytics.lowInventoryItems > 0 ? "Needs restock (< 5 units)" : "All stocked"}
                />
              </div>

              {/* Charts Section: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Weekly Sales & Revenue Bar Chart (Span 2) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Revenue & Sales Trends</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Daily performance over the last 7 days</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          7-Day Sales: <strong className="text-gray-900">₹{weekTotalRevenue.toLocaleString('en-IN')}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          Orders: <strong className="text-gray-900">{weekTotalOrders}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Bar Chart Graphic */}
                    <div className="mt-6 h-60 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                      {trendData.map((item, index) => {
                        const heightPct = Math.max(8, Math.round(((item.revenue || 0) / maxTrendRevenue) * 100));
                        const isHovered = hoveredBarIndex === index;

                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                            onMouseEnter={() => setHoveredBarIndex(index)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                          >
                            {/* Hover Tooltip */}
                            {isHovered && (
                              <div className="absolute -top-12 z-20 bg-gray-900 text-white text-[11px] rounded-lg px-2.5 py-1 shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn">
                                <p className="font-semibold text-blue-300">{item.date} ({item.day})</p>
                                <p>₹{item.revenue.toLocaleString('en-IN')} • {item.orders} order(s)</p>
                              </div>
                            )}

                            {/* Bar Column */}
                            <div className="w-full max-w-[42px] bg-gray-100 rounded-t-lg overflow-hidden flex items-end h-full">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-lg transition-all duration-300 ${
                                  item.revenue > 0
                                    ? isHovered
                                      ? 'bg-blue-700 shadow-md scale-[1.02]'
                                      : 'bg-gradient-to-t from-blue-600 to-indigo-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                            </div>

                            {/* Date / Day Label */}
                            <div className="mt-2.5 text-center">
                              <span className="block text-xs font-semibold text-gray-700">{item.day}</span>
                              <span className="block text-[10px] text-gray-400">{item.date.split(' ')[1]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                    <span>* Hover over bars to view detailed revenue & order stats</span>
                    <span className="font-medium text-blue-600">Updated in real-time</span>
                  </div>
                </div>

                {/* 2. Order Fulfillment Status Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Order Fulfillment Status</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Distribution across lifecycle stages</p>

                    {/* Segmented Progress Bar */}
                    <div className="mt-6">
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        {totalBreakdownOrders > 0 ? (
                          <>
                            <div
                              style={{ width: `${getPercent(breakdown.delivered)}%` }}
                              className="bg-emerald-500 transition-all duration-500"
                              title={`Delivered: ${breakdown.delivered}`}
                            />
                            <div
                              style={{ width: `${getPercent(breakdown.shipped)}%` }}
                              className="bg-blue-500 transition-all duration-500"
                              title={`Shipped: ${breakdown.shipped}`}
                            />
                            <div
                              style={{ width: `${getPercent(breakdown.processing)}%` }}
                              className="bg-amber-400 transition-all duration-500"
                              title={`Processing: ${breakdown.processing}`}
                            />
                            <div
                              style={{ width: `${getPercent(breakdown.cancelled)}%` }}
                              className="bg-rose-500 transition-all duration-500"
                              title={`Cancelled: ${breakdown.cancelled}`}
                            />
                          </>
                        ) : (
                          <div className="w-full bg-gray-200" />
                        )}
                      </div>
                    </div>

                    {/* Status Legend Breakdown Cards */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="font-semibold text-emerald-900">Delivered</span>
                        </div>
                        <div className="text-xs text-right">
                          <span className="font-bold text-gray-900">{breakdown.delivered || 0}</span>
                          <span className="text-gray-500 ml-1">({getPercent(breakdown.delivered)}%)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span className="font-semibold text-blue-900">Shipped</span>
                        </div>
                        <div className="text-xs text-right">
                          <span className="font-bold text-gray-900">{breakdown.shipped || 0}</span>
                          <span className="text-gray-500 ml-1">({getPercent(breakdown.shipped)}%)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                          <span className="font-semibold text-amber-900">Processing</span>
                        </div>
                        <div className="text-xs text-right">
                          <span className="font-bold text-gray-900">{breakdown.processing || 0}</span>
                          <span className="text-gray-500 ml-1">({getPercent(breakdown.processing)}%)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span className="font-semibold text-rose-900">Cancelled</span>
                        </div>
                        <div className="text-xs text-right">
                          <span className="font-bold text-gray-900">{breakdown.cancelled || 0}</span>
                          <span className="text-gray-500 ml-1">({getPercent(breakdown.cancelled)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/orders"
                    className="mt-4 block text-center py-2 px-3 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg transition"
                  >
                    Manage All Orders →
                  </Link>
                </div>
              </div>

              {/* Low Inventory Section */}
              {analytics.lowInventoryProducts && analytics.lowInventoryProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                      <span>⚠️</span> Low Inventory Stock Alerts
                    </h3>
                    <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
                      Update Stock in Products →
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {analytics.lowInventoryProducts.map((p) => (
                      <div key={p._id} className="py-3 flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-800">{p.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">₹{(p.price || 0).toLocaleString('en-IN')}</span>
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