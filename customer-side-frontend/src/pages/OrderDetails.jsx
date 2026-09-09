import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        setOrder(data.order);
      } catch (err) {
        console.error("Load order details error:", err);
        setError(
          err.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-[#6B6F6D]">
          Loading order details...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[#14201C]">
            Order Not Found
          </h1>

          <p className="mt-3 text-red-600">
            {error || "Unable to find this order."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/orders"
            className="text-sm font-medium text-[#0F2C27] hover:underline"
          >
            ← Back to My Orders
          </Link>

          <p className="mt-6 text-sm font-medium text-[#B8892B]">
            Order Details
          </p>

          <h1 className="mt-2 break-all font-serif text-3xl tracking-tight text-[#14201C]">
            {order._id}
          </h1>

          <p className="mt-2 text-[#6B6F6D]">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl text-[#14201C]">
              Order Status
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAFAF7] p-4">
                <p className="text-xs text-[#6B6F6D]">
                  Payment Status
                </p>

                <p
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>

              <div className="rounded-xl bg-[#FAFAF7] p-4">
                <p className="text-xs text-[#6B6F6D]">
                  Order Status
                </p>

                <p
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.orderStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Store */}
          <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl text-[#14201C]">
              Store
            </h2>

            <p className="mt-3 font-semibold text-[#14201C]">
              {order.storeId?.name || "Store"}
            </p>

            {order.storeId?.contactEmail && (
              <p className="mt-1 text-sm text-[#6B6F6D]">
                {order.storeId.contactEmail}
              </p>
            )}
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-[#E4E1D9] bg-white shadow-sm">
            <div className="border-b border-[#E4E1D9] p-6">
              <h2 className="font-serif text-xl text-[#14201C]">
                Ordered Products
              </h2>
            </div>

            <div className="divide-y divide-[#F0EEE8]">
              {order.products?.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FAFAF7]">
                      {item.productId?.images?.[0] ? (
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-[#9A9D96]">
                          No Image
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-[#14201C]">
                        {item.productId?.name || "Product"}
                      </p>

                      <p className="mt-1 text-sm text-[#6B6F6D]">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-[#6B6F6D]">
                        Price: ₹
                        {Number(
                          item.priceAtPurchase
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#6B6F6D]">
                      Item Total
                    </p>

                    <p className="mt-1 font-bold text-[#14201C]">
                      ₹
                      {(
                        item.priceAtPurchase *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl text-[#14201C]">
              Shipping Address
            </h2>

            <div className="mt-4 text-sm text-[#6B6F6D]">
              <p>
                {order.shippingAddress?.city || "N/A"}
              </p>

              <p className="mt-1">
                {order.shippingAddress?.state || "N/A"}
              </p>

              <p className="mt-1">
                {order.shippingAddress?.country || "N/A"}
              </p>
            </div>
          </div>

          {/* Order Total */}
          <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-[#14201C]">
                Order Total
              </span>

              <span className="text-2xl font-bold text-[#14201C]">
                ₹
                {Number(order.totalAmount).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;