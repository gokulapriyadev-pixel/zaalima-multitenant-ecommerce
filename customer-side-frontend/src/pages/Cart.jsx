import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {

  selectCartTotalItems,
  selectCartTotalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  selectCartItems,
} from "../redux/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-gray-600">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>

        </div>
      </section>

      {/* Cart Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >

                <div className="flex flex-col gap-5 sm:flex-row">

                  {/* Image */}
                  <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-gray-100 sm:w-32">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        Product Image
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-lg font-bold text-gray-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">

                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          disabled={item.quantity === 1}
                          className="px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleIncrease(item.id)}
                          disabled={item.quantity >= item.stock}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          +
                        </button>

                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                  {/* Item Total */}
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">
                      Item Total
                    </p>

                    <p className="mt-1 font-bold text-gray-900">
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Items
                </span>

                <span className="font-medium text-gray-900">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

            </div>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-lg bg-black px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-black hover:underline"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Cart;