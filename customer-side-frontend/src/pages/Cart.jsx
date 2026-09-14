import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../services/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storeId = "6a906244ca9fe895152f0133";

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCart(storeId);

        const items = (data.items || []).map((item) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.images?.[0] || "",
          stock: item.productId.inventoryCount || 0,
          quantity: item.quantity,
          storeId: data.storeId,
        }));

        setCartItems(items);
      } catch (err) {
        console.error("Load cart error:", err);
        setError(err.message || "Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Increase / decrease quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      setError("");

      const data = await updateCartItemQuantity(
        storeId,
        productId,
        newQuantity
      );

      const items = (data.items || []).map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || "",
        stock: item.productId.inventoryCount || 0,
        quantity: item.quantity,
        storeId: data.storeId,
      }));

      setCartItems(items);
    } catch (err) {
      console.error("Update cart error:", err);
      setError(err.message || "Failed to update cart.");
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      setError("");

      const data = await removeFromCart(storeId, productId);

      const items = (data.items || []).map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || "",
        stock: item.productId.inventoryCount || 0,
        quantity: item.quantity,
        storeId: data.storeId,
      }));

      setCartItems(items);
    } catch (err) {
      console.error("Remove cart item error:", err);
      setError(err.message || "Failed to remove item.");
    }
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading cart...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Failed to Load Cart
          </h1>

          <p className="mt-3 text-red-600">{error}</p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

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

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
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
                      {/* Quantity Controls */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className={`px-4 py-2 ${
                            item.quantity <= 1
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          −
                        </button>

                        <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className={`px-4 py-2 ${
                            item.quantity >= item.stock
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

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

          {/* Order Summary */}
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