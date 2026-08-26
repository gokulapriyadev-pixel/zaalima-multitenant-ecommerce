import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  // Temporary mock data.
  // Later this will come from the backend API using the order ID.
  const order = {
    id: id,
    date: "24 Aug 2026",
    status: "Delivered",

    customer: {
      name: "Customer Name",
      email: "customer@example.com",
      phone: "+91 98765 43210",
    },

    address: {
      street: "123 Main Street",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },

    payment: {
      method: "Online Payment",
      status: "Paid",
    },

    items: [
      {
        id: 1,
        name: "Classic T-Shirt",
        price: 799,
        quantity: 2,
      },
      {
        id: 2,
        name: "Casual Sneakers",
        price: 1200,
        quantity: 1,
      },
    ],

    subtotal: 2798,
    shipping: 0,
    total: 2798,
  };

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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <Link
                to="/orders"
                className="text-sm font-medium text-[#6B6F6D] hover:text-[#0F2C27]"
              >
                ← Back to Orders
              </Link>

              <h1 className="mt-3 font-serif text-3xl tracking-tight text-[#14201C]">
                Order Details
              </h1>

              <p className="mt-2 text-sm text-[#6B6F6D]">
                Order #{order.id}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </span>

          </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">

            {/* Order Items */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white shadow-sm">

              <div className="border-b border-[#E4E1D9] p-6">
                <h2 className="font-serif text-xl text-[#14201C]">
                  Order Items
                </h2>
              </div>

              <div className="divide-y divide-[#F0EEE8]">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      {/* Product Image */}
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#FAFAF7]">
                        <span className="text-xs text-[#9A9D96]">
                          Image
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#14201C]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#6B6F6D]">
                          ₹{item.price.toLocaleString("en-IN")} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                    </div>

                    <p className="font-bold text-[#14201C]">
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* Delivery Address */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">

              <h2 className="font-serif text-xl text-[#14201C]">
                Delivery Address
              </h2>

              <div className="mt-5 rounded-xl bg-[#FAFAF7] p-5">

                <p className="font-semibold text-[#14201C]">
                  {order.customer.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6B6F6D]">
                  {order.address.street}
                  <br />
                  {order.address.city}, {order.address.state}
                  <br />
                  PIN: {order.address.pincode}
                </p>

                <div className="mt-4 border-t border-[#E4E1D9] pt-4">

                  <p className="text-sm text-[#6B6F6D]">
                    Phone:{" "}
                    <span className="font-medium text-[#14201C]">
                      {order.customer.phone}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-[#6B6F6D]">
                    Email:{" "}
                    <span className="font-medium text-[#14201C]">
                      {order.customer.email}
                    </span>
                  </p>

                </div>

              </div>

            </div>

            {/* Payment Information */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">

              <h2 className="font-serif text-xl text-[#14201C]">
                Payment Information
              </h2>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm text-[#6B6F6D]">
                    Payment Method
                  </p>

                  <p className="mt-1 font-medium text-[#14201C]">
                    {order.payment.method}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6B6F6D]">
                    Payment Status
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    {order.payment.status}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Right Summary */}
          <aside className="h-fit rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">

            <h2 className="font-serif text-xl text-[#14201C]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-[#6B6F6D]">
                  Order Date
                </span>

                <span className="font-medium text-[#14201C]">
                  {order.date}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#6B6F6D]">
                  Subtotal
                </span>

                <span className="font-medium text-[#14201C]">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#6B6F6D]">
                  Shipping
                </span>

                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>

              <div className="border-t border-[#E4E1D9] pt-4">

                <div className="flex justify-between">

                  <span className="font-semibold text-[#14201C]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#14201C]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

            </div>

            <Link
              to="/orders"
              className="mt-6 block w-full rounded-lg border border-[#0F2C27]/20 px-6 py-3 text-center text-sm font-semibold text-[#14201C] transition hover:bg-[#0F2C27]/5"
            >
              Back to My Orders
            </Link>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default OrderDetails;