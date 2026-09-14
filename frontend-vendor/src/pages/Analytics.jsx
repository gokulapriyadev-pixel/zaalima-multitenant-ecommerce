import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";

const SAMPLE_ORDERS = [
  { totalAmount: 1298, status: "delivered", createdAt: "2026-09-08T10:00:00Z" },
  { totalAmount: 2499, status: "shipped", createdAt: "2026-09-09T10:00:00Z" },
  { totalAmount: 899, status: "processing", createdAt: "2026-09-10T10:00:00Z" },
  { totalAmount: 3499, status: "delivered", createdAt: "2026-09-11T10:00:00Z" },
  { totalAmount: 1750, status: "shipped", createdAt: "2026-09-12T10:00:00Z" },
  { totalAmount: 2100, status: "delivered", createdAt: "2026-09-13T10:00:00Z" },
  { totalAmount: 640, status: "processing", createdAt: "2026-09-14T10:00:00Z" },
];

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function buildDailySeries(orders) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: 0,
      orders: 0,
    });
  }

  orders.forEach((o) => {
    if (!o.createdAt) return;
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const day = days.find((d) => d.key === key);
    if (day) {
      day.orders += 1;
      day.revenue += Number(o.totalAmount || 0);
    }
  });

  return days;
}

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingSample, setUsingSample] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setUsingSample(false);

    try {
      const storeRes = await api.get("/stores/my-store");
      const store = storeRes.data.store || storeRes.data;

      if (!store?._id) throw new Error("No store found");

      const res = await api.get(`/orders/store/${store._id}`);
      const data = res.data;
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setUsingSample(true);
      setOrders(SAMPLE_ORDERS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const series = buildDailySeries(orders);
  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const processing = orders.filter(
    (o) => String(o.status).toLowerCase() === "processing"
  ).length;

  if (loading) return <div className="p-6"><Spinner label="Loading analytics…" /></div>;
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={load} /></div>;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Analytics</h1>
          <p className="text-gray-500">
            Revenue and order performance for your store.
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {usingSample && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Live order API unavailable — showing sample data.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={inr(totalRevenue)} />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Avg Order Value" value={inr(avgOrder)} />
        <StatCard label="Processing Orders" value={processing} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="font-medium text-gray-800 mb-4">Revenue — last 7 days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => inr(v)} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-medium text-gray-800 mb-4">Order volume — last 7 days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

export default Analytics;