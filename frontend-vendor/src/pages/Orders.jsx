import { useEffect, useState } from "react";
import OrderTable from "../components/OrderTable";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";

const SAMPLE_ORDERS = [
  {
    _id: "65f1a2b3c4d5e6f708192a3b",
    customerName: "Anitha R",
    items: [{ name: "Cotton T-Shirt", qty: 2 }],
    totalAmount: 1298,
    status: "paid",
    createdAt: "2026-09-12T10:15:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f708192a4c",
    customerName: "Karthik S",
    items: [{ name: "Running Shoes", qty: 1 }],
    totalAmount: 2499,
    status: "pending",
    createdAt: "2026-09-13T14:40:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f708192a5d",
    customerName: "Divya M",
    items: [{ name: "Leather Wallet", qty: 1 }],
    totalAmount: 899,
    status: "shipped",
    createdAt: "2026-09-13T09:20:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f708192a6e",
    customerName: "Ravi K",
    items: [{ name: "Wireless Earbuds", qty: 1 }],
    totalAmount: 3499,
    status: "cancelled",
    createdAt: "2026-09-14T08:05:00.000Z",
  },
];

const FILTERS = ["all", "pending", "paid", "shipped", "delivered", "cancelled"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);
  const [filter, setFilter] = useState("all");

  async function fetchOrders() {
    setLoading(true);
    setUsingSample(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Could not load orders");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      // Backend order API not ready yet — fall back to sample data
      setUsingSample(true);
      setOrders(SAMPLE_ORDERS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const visibleOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => String(o.status).toLowerCase() === filter);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Orders</h1>
          <p className="text-gray-500">
            Incoming customer orders placed against your store.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {usingSample && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Live order API unavailable — showing sample data.
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filter === s
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading orders…" />
      ) : (
        <OrderTable orders={visibleOrders} />
      )}
    </div>
  );
}

export default Orders;