import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import api from "../services/api";

const getSampleOrders = () => {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  return [
    { totalAmount: 1298, orderStatus: "delivered", createdAt: new Date(now.getTime() - 6 * dayMs).toISOString() },
    { totalAmount: 2499, orderStatus: "shipped", createdAt: new Date(now.getTime() - 5 * dayMs).toISOString() },
    { totalAmount: 899, orderStatus: "processing", createdAt: new Date(now.getTime() - 4 * dayMs).toISOString() },
    { totalAmount: 3499, orderStatus: "delivered", createdAt: new Date(now.getTime() - 3 * dayMs).toISOString() },
    { totalAmount: 1750, orderStatus: "shipped", createdAt: new Date(now.getTime() - 2 * dayMs).toISOString() },
    { totalAmount: 2100, orderStatus: "delivered", createdAt: new Date(now.getTime() - 1 * dayMs).toISOString() },
    { totalAmount: 1450, orderStatus: "processing", createdAt: now.toISOString() },
  ];
};

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function buildDailySeries(orders) {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      revenue: 0,
      orders: 0,
    });
  }

  orders.forEach((o) => {
    if (!o.createdAt) return;
    try {
      const date = new Date(o.createdAt);
      if (isNaN(date.getTime())) return;
      const key = date.toISOString().slice(0, 10);
      const day = days.find((d) => d.key === key);

      if (day) {
        day.orders += 1;
        day.revenue += Number(o.totalAmount || 0);
      }
    } catch {
      // Ignore unparseable dates
    }
  });

  return days;
}

function Analytics() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingSample, setUsingSample] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setUsingSample(false);

    try {
      // 1. Fetch vendor's store
      const storeRes = await api.get("/stores/my-store");
      const currentStore = storeRes.data.store || storeRes.data;
      setStore(currentStore);

      if (!currentStore?._id) {
        throw new Error("No store found. Please create a store first.");
      }

      // 2. Fetch orders for this store
      const res = await api.get(`/orders/store/${currentStore._id}`);
      const data = res.data;
      const orderList = Array.isArray(data) ? data : data.orders || [];

      setOrders(orderList);
      if (orderList.length === 0) {
        // If store exists but has 0 real orders yet, we use sample data for visualization
        setUsingSample(true);
        setOrders(getSampleOrders());
      }
    } catch (err) {
      console.warn("Live analytics fetch failed, using fallback sample:", err);
      setUsingSample(true);
      setOrders(getSampleOrders());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const series = buildDailySeries(orders);

  const totalRevenue = orders.reduce(
    (s, o) => s + Number(o.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  const avgOrder = totalOrders
    ? Math.round(totalRevenue / totalOrders)
    : 0;

  const processing = orders.filter(
    (o) => String(o.orderStatus || o.status || "").toLowerCase() === "processing"
  ).length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Vendor Sidebar */}
      <Sidebar activePage="analytics" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <TopBar title={store?.name ? `${store.name} Analytics` : "Store Analytics"} />

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Spinner label="Loading analytics…" />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorState message={error} onRetry={load} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Title & Refresh */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">
                      Store Analytics
                    </h1>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Last 7 Days
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Track revenue, order performance, and sales trends.
                  </p>
                </div>

                <button
                  onClick={load}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white bg-white shadow-sm transition"
                >
                  Refresh Data
                </button>
              </div>

              {usingSample && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center justify-between">
                  <span>
                    <strong>Demo Preview:</strong> Showing sample performance metrics because no live orders were found or API is unavailable.
                  </span>
                </div>
              )}

              {/* Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={inr(totalRevenue)} subtext="Past 7 days" />
                <StatCard label="Total Orders" value={totalOrders} subtext="Total placed" />
                <StatCard label="Avg Order Value" value={inr(avgOrder)} subtext="Per customer order" />
                <StatCard label="Processing Orders" value={processing} subtext="Requires fulfillment" />
              </div>

              {/* Revenue Trend Line Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">
                    Revenue Trend (Last 7 Days)
                  </h2>
                  <span className="text-xs text-gray-400">Values in INR (₹)</span>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip formatter={(v) => inr(v)} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2563eb" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Volume Bar Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">
                    Daily Order Volume
                  </h2>
                  <span className="text-xs text-gray-400">Order count</span>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip />
                      <Bar
                        dataKey="orders"
                        fill="#4f46e5"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default Analytics;