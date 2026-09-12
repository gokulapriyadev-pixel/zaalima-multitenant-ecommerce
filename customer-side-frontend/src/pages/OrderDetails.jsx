import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, AlertCircle } from "lucide-react";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.response?.data?.message || "Order not found or you are not authorized to view it.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

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

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-[#6B6F6D]">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={44} className="mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl text-[#14201C]">Unable to Load Order</h1>
          <p className="mt-2 text-sm text-[#6B6F6D]">{error || "The requested order could not be found."}</p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2C27] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "Recent";

  const storeName = order.storeId?.name || "Marketplace Store";

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-16">
      {/* Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6F6D] hover:text-[#0F2C27] mb-4"
          >
            <ArrowLeft size={14} />
            Back to My Orders
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#6B6F6D]">Order #{order._id}</p>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl tracking-tight text-[#14201C]">
                Receipt & Order Summary
              </h1>
              <p className="mt-1 text-xs text-[#6B6F6D]">Placed on {formattedDate}</p>
            </div>

            <div className="flex items-center gap-2">
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
                {order.paymentStatus || "Pending"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-lg text-[#14201C] mb-4">Purchased Items</h2>
              <div className="divide-y divide-[#E4E1D9]/60">
                {order.products?.map((item, idx) => {
                  const product = item.productId || {};
                  const image = product.images?.[0] || "";

                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
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
                            Quantity: {item.quantity} × ₹{item.priceAtPurchase?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-sm text-[#14201C]">
                        ₹{((item.priceAtPurchase || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-lg text-[#14201C] mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-[#B8892B]" />
                Shipping Destination
              </h2>
              {order.shippingAddress ? (
                <div className="text-sm text-[#6B6F6D] space-y-1">
                  <p className="font-medium text-[#14201C]">{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country || "India"}</p>
                </div>
              ) : (
                <p className="text-sm text-[#6B6F6D]">Standard Digital / Direct Delivery</p>
              )}
            </div>
          </div>

          {/* Right Column: Cost Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-lg text-[#14201C] mb-4">Payment Summary</h2>

              <div className="space-y-3 text-sm border-b border-[#E4E1D9] pb-4">
                <div className="flex justify-between text-[#6B6F6D]">
                  <span>Subtotal</span>
                  <span className="text-[#14201C]">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#6B6F6D]">
                  <span>Delivery</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-[#6B6F6D]">
                  <span>Vendor</span>
                  <span className="text-[#14201C] font-medium">{storeName}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-base">
                <span className="font-bold text-[#14201C]">Total Paid</span>
                <span className="font-bold text-xl text-[#0F2C27]">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E4E1D9] bg-[#FAFAF7] p-5 text-center">
              <p className="text-xs text-[#6B6F6D]">
                Need help with this order? Contact vendor support referencing your Order ID.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;