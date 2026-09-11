import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get('/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "Failed to load orders. Please make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-16">
      {/* Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
            Customer Portal
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl tracking-tight text-[#14201C]">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-[#6B6F6D]">
            Track status, review history, and view order receipts.
          </p>
        </div>
      </section>

      {/* Orders List */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-2xl border border-[#E4E1D9] bg-white py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-[#6B6F6D]">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle size={36} className="mx-auto text-red-500 mb-3" />
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <Link
              to="/login"
              className="mt-4 inline-block rounded-xl bg-[#0F2C27] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#123832]"
            >
              Go to Login
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-20 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-serif text-[#14201C]">No orders placed yet</h2>
            <p className="mt-2 text-sm text-[#6B6F6D] max-w-md mx-auto">
              You haven't purchased anything yet. Explore our curated vendors and discover great products.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "Recent";

              const storeName = order.storeId?.name || "Store";

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white shadow-sm transition hover:border-[#B8892B]/50"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E1D9] bg-[#FAFAF7] px-6 py-4 text-sm">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-xs text-[#6B6F6D] block">ORDER PLACED</span>
                        <span className="font-medium text-[#14201C]">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#6B6F6D] block">TOTAL AMOUNT</span>
                        <span className="font-bold text-[#14201C]">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-[#6B6F6D] block">STORE</span>
                        <span className="font-medium text-[#14201C]">{storeName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${getPaymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.products?.map((item, idx) => {
                        const product = item.productId || {};
                        const image = product.images?.[0] || "";

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between border-b border-[#E4E1D9]/50 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#FAFAF7] overflow-hidden border border-[#E4E1D9]">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name || "Product"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm text-[#14201C]">
                                  {product.name || "Product Item"}
                                </h3>
                                <p className="text-xs text-[#6B6F6D] mt-0.5">
                                  Qty: {item.quantity} × ₹{item.priceAtPurchase?.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>

                            <span className="font-semibold text-sm text-[#14201C]">
                              ₹{((item.priceAtPurchase || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-6 pt-4 border-t border-[#E4E1D9] flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-[#6B6F6D] font-mono">
                        Order #{order._id}
                      </span>
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#0F2C27] hover:underline"
                      >
                        View Full Details
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;