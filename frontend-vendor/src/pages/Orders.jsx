import { useEffect, useState } from "react";
import OrderTable from "../components/OrderTable";

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
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/orders/vendor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Could not load orders");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        // Backend order API not ready yet — show sample data so the UI is testable
        setError(err.message);
        setOrders(SAMPLE_ORDERS);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Orders</h1>
      <p className="text-gray-500 mb-6">
        Incoming customer orders placed against your store.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Live order API unavailable — showing sample data.
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-gray-500">
          Loading orders…
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}

export default Orders;