import { Link } from "react-router-dom";

function Orders() {
  // Temporary mock data.
  // Later this will come from the backend API.
  const orders = [
    {
      id: "ORD-1001",
      date: "24 Aug 2026",
      status: "Delivered",
      total: 2798,
      items: [
        {
          id: 1,
          name: "Classic T-Shirt",
          quantity: 2,
          price: 799,
        },
        {
          id: 2,
          name: "Casual Sneakers",
          quantity: 1,
          price: 1200,
        },
      ],
    },
    {
      id: "ORD-1002",
      date: "20 Aug 2026",
      status: "Processing",
      total: 2499,
      items: [
        {
          id: 3,
          name: "Wireless Headphones",
          quantity: 1,
          price: 2499,
        },
      ],
    },
    {
      id: "ORD-1003",
      date: "15 Aug 2026",
      status: "Cancelled",
      total: 1499,
      items: [
        {
          id: 4,
          name: "Backpack",
          quantity: 1,
          price: 1499,
        },
      ],
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7]">

      {/* Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <p className="text-sm font-medium text-[#B8892B]">
            Account
          </p>

          <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
            My Orders
          </h1>

          <p className="mt-2 text-[#6B6F6D]">
            View and track your previous orders.
          </p>

        </div>
      </section>

      {/* Orders */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-16 text-center">

            <h2 className="font-serif text-2xl text-[#14201C]">
              No Orders Yet
            </h2>

            <p className="mt-3 text-[#6B6F6D]">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white shadow-sm"
              >

                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-[#E4E1D9] p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm text-[#6B6F6D]">
                      Order
                    </p>

                    <h2 className="mt-1 font-semibold text-[#14201C]">
                      {order.id}
                    </h2>

                    <p className="mt-1 text-sm text-[#6B6F6D]">
                      Placed on {order.date}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">

                    <div>
                      <p className="text-xs text-[#6B6F6D]">
                        Total
                      </p>

                      <p className="mt-1 font-bold text-[#14201C]">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

                {/* Order Items */}
                <div className="divide-y divide-[#F0EEE8]">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-5"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#FAFAF7]">
                          <span className="text-xs text-[#9A9D96]">
                            Image
                          </span>
                        </div>

                        <div>
                          <p className="font-medium text-[#14201C]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-sm text-[#6B6F6D]">
                            Qty: {item.quantity}
                          </p>
                        </div>

                      </div>

                      <p className="text-sm font-semibold text-[#14201C]">
                        ₹
                        {(item.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  ))}

                </div>

                {/* Footer */}
                <div className="border-t border-[#E4E1D9] bg-[#FAFAF7] p-4 text-right">

                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-semibold text-[#0F2C27] hover:underline"
                  >
                    View Order Details →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default Orders;