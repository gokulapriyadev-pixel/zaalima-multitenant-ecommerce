import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getMyOrders,
  getStoreOrders,
  updateOrderStatus,
} from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isVendor, setIsVendor] = useState(false);
  const [statusValues, setStatusValues] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        const vendor =
          user?.role === "vendor" ||
          user?.role === "super_admin";

        setIsVendor(vendor);

        let data;

        if (vendor) {
          // Test Vendor Store
          const storeId = "6a8b02d771b18c7ee8ea1919";

          data = await getStoreOrders(storeId);
        } else {
          data = await getMyOrders();
        }

        const loadedOrders = data.orders || [];

        setOrders(loadedOrders);

        // Set current status for every order
        const initialStatuses = {};

        loadedOrders.forEach((order) => {
          initialStatuses[order._id] = order.orderStatus;
        });

        setStatusValues(initialStatuses);
      } catch (err) {
        console.error("Load orders error:", err);
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Change dropdown value
  const handleStatusChange = (orderId, value) => {
    setStatusValues((previous) => ({
      ...previous,
      [orderId]: value,
    }));
  };

  // Update order status
  const handleUpdateStatus = async (orderId) => {
    try {
      const newStatus = statusValues[orderId];

      if (!newStatus) {
        return;
      }

      setUpdatingOrderId(orderId);
      setError("");

      const result = await updateOrderStatus(
        orderId,
        newStatus
      );

      console.log("Order status updated:", result);

      // Update UI immediately
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: newStatus,
              }
            : order
        )
      );

      alert("Order status updated successfully.");
    } catch (err) {
      console.error("Update order status error:", err);

      setError(
        err.message || "Failed to update order status."
      );

      alert(
        err.message || "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId("");
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-[#6B6F6D]">
          Loading orders...
        </p>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[#14201C]">
            Failed to Load Orders
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // No orders
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAF7]">
        <section className="border-b border-[#E4E1D9] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            <p className="text-sm font-medium text-[#B8892B]">
              {isVendor ? "Vendor" : "Account"}
            </p>

            <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
              {isVendor ? "Store Orders" : "My Orders"}
            </h1>

            <p className="mt-2 text-[#6B6F6D]">
              {isVendor
                ? "View and manage orders for your store."
                : "View and track your previous orders."}
            </p>

          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-16 text-center">

            <h2 className="font-serif text-2xl text-[#14201C]">
              No Orders Yet
            </h2>

            <p className="mt-3 text-[#6B6F6D]">
              {isVendor
                ? "Your store does not have any orders yet."
                : "You haven't placed any orders yet."}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
            >
              Start Shopping
            </Link>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">

      {/* Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <p className="text-sm font-medium text-[#B8892B]">
            {isVendor ? "Vendor" : "Account"}
          </p>

          <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
            {isVendor ? "Store Orders" : "My Orders"}
          </h1>

          <p className="mt-2 text-[#6B6F6D]">
            {isVendor
              ? "View and manage orders for your store."
              : "View and track your previous orders."}
          </p>

        </div>
      </section>

      {/* Orders */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white shadow-sm"
            >

              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-[#E4E1D9] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm text-[#6B6F6D]">
                    Order
                  </p>

                  <h2 className="mt-1 break-all font-semibold text-[#14201C]">
                    {order._id}
                  </h2>

                  <p className="mt-1 text-sm text-[#6B6F6D]">
                    Placed on{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">

                  <div>
                    <p className="text-xs text-[#6B6F6D]">
                      Total
                    </p>

                    <p className="mt-1 font-bold text-[#14201C]">
                      ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      Order: {order.orderStatus}
                    </span>

                  </div>

                </div>

              </div>

              {/* Store */}
              <div className="border-b border-[#E4E1D9] px-5 py-4">

                <p className="text-xs text-[#6B6F6D]">
                  Store
                </p>

                <p className="mt-1 font-medium text-[#14201C]">
                  {order.storeId?.name || "Store"}
                </p>

              </div>

              {/* Order Items */}
              <div className="divide-y divide-[#F0EEE8]">

                {order.products?.map((item) => (

                  <div
                    key={item._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FAFAF7]">

                        {item.productId?.images?.[0] ? (

                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <span className="text-xs text-[#9A9D96]">
                            Image
                          </span>

                        )}

                      </div>

                      <div>

                        <p className="font-medium text-[#14201C]">
                          {item.productId?.name ||
                            "Product"}
                        </p>

                        <p className="mt-1 text-sm text-[#6B6F6D]">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-[#6B6F6D]">
                          ₹
                          {Number(
                            item.priceAtPurchase
                          ).toLocaleString("en-IN")}{" "}
                          each
                        </p>

                      </div>

                    </div>

                    <p className="text-sm font-semibold text-[#14201C]">
                      ₹
                      {(
                        Number(item.priceAtPurchase) *
                        Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>

              {/* VENDOR STATUS CONTROL */}
              {isVendor && (
                <div className="border-t border-[#E4E1D9] bg-[#FAFAF7] p-5">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                      <label
                        htmlFor={`status-${order._id}`}
                        className="block text-sm font-semibold text-[#14201C]"
                      >
                        Update Order Status
                      </label>

                      <select
                        id={`status-${order._id}`}
                        value={
                          statusValues[order._id] ||
                          order.orderStatus
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                        disabled={
                          updatingOrderId === order._id
                        }
                        className="mt-2 w-full rounded-lg border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#14201C] outline-none focus:border-[#0F2C27] sm:w-64"
                      >
                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(order._id)
                      }
                      disabled={
                        updatingOrderId === order._id
                      }
                      className="rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123832] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : "Update Status"}
                    </button>

                  </div>

                </div>
              )}

              {/* Footer */}
              <div className="border-t border-[#E4E1D9] bg-white p-4 text-right">

                <Link
                  to={`/orders/${order._id}`}
                  className="text-sm font-semibold text-[#0F2C27] hover:underline"
                >
                  View Order Details →
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Orders;