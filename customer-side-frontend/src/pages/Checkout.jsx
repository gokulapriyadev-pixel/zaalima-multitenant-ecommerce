import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getProductById,
} from "../services/api";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectAppliedCoupon,
  selectDiscountAmount,
  selectFinalTotalPrice,
  clearCart,
} from "../redux/cartSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const discountAmount = useSelector(selectDiscountAmount);
  const finalTotalPrice = useSelector(selectFinalTotalPrice);

  const targetStoreId =
    cartItems[0]?.storeId || cartItems[0]?.store?._id || cartItems[0]?.store;
  const storeName = cartItems[0]?.storeName || "Store";

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (mongoOrderId) => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
      throw new Error(
        "Razorpay Key ID is not configured in the frontend."
      );
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error(
        "Unable to load Razorpay Checkout."
      );
    }

    const razorpayResult = await createRazorpayOrder(
      mongoOrderId
    );

    const razorpayOrder = razorpayResult.order;

    const options = {
      key: razorpayKeyId,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      name: "Zaalima",

      description: `Order from ${storeName}`,

      order_id: razorpayOrder.id,

      handler: async function (response) {
        console.log("RAZORPAY SUCCESS HANDLER FIRED:", response);

        try {
          setPlacingOrder(true);
          setError("");

          const verificationResult =
            await verifyRazorpayPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            });

          console.log(
            "Payment verification result:",
            verificationResult
          );

          dispatch(clearCart());
          navigate(`/order-success/${mongoOrderId}`);
        } catch (err) {
          console.error(
            "Payment verification error:",
            err
          );

          setError(
            err.message ||
              "Payment verification failed."
          );
        } finally {
          setPlacingOrder(false);
        }
      },

      prefill: {
        name: shippingAddress.name,
        contact: shippingAddress.phone,
      },

      notes: {
        mongoOrderId: mongoOrderId,
      },

      theme: {
        color: "#0F2C27",
      },

      modal: {
        ondismiss: function () {
          setPlacingOrder(false);

          setError(
            "Payment window was closed."
          );
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      function (response) {
        console.error(
          "Razorpay payment failed:",
          response
        );

        setPlacingOrder(false);

        setError(
          response.error?.description ||
            "Payment failed."
        );
      }
    );

    razorpay.open();
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    try {
      setPlacingOrder(true);
      setError("");

      let activeStoreId =
        targetStoreId ||
        cartItems[0]?.storeId ||
        cartItems[0]?.store?._id ||
        cartItems[0]?.store;

      // Auto-recovery: If storeId was missing from older cart items, fetch product to resolve store
      if (!activeStoreId && cartItems.length > 0) {
        try {
          const firstProductId = cartItems[0].id || cartItems[0]._id;
          if (firstProductId) {
            const productData = await getProductById(firstProductId);
            if (productData?.product?.storeId) {
              activeStoreId =
                typeof productData.product.storeId === "object"
                  ? productData.product.storeId._id
                  : productData.product.storeId;
            }
          }
        } catch (recoveryErr) {
          console.warn("Could not auto-recover storeId for cart item:", recoveryErr);
        }
      }

      if (!activeStoreId) {
        setError("Unable to identify store for this order. Please clear your cart and re-add the item.");
        setPlacingOrder(false);
        return;
      }

      /*
       * Step 1:
       * Create MongoDB order.
       */
      const productsPayload = cartItems.map((item) => ({
        productId: item.id || item._id,
        quantity: item.quantity,
      }));

      const result = await createOrder({
        storeId: activeStoreId,
        products: productsPayload,
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.pincode,
          country: "India",
        },
        couponCode: appliedCoupon?.code,
      });

      const mongoOrderId = result.order._id;

      console.log(
        "MongoDB order created:",
        mongoOrderId
      );

      /*
       * Step 2:
       * Create Razorpay order and open
       * Razorpay Checkout.
       */
      await openRazorpayCheckout(
        mongoOrderId
      );
    } catch (err) {
      console.error(
        "Checkout / payment error:",
        err
      );

      setError(
        err.message ||
          "Failed to start payment."
      );

      setPlacingOrder(false);
    }
  };

  if (error && cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Checkout Error
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Cart
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
              Add products to your cart before
              checkout.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white"
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
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Complete your order details below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Shipping Address */}

          <div className="lg:col-span-2">
            <form
              onSubmit={handlePlaceOrder}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h2>

              {error && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Address */}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="House number, street, area"
                  />
                </div>

                {/* City */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter city"
                  />
                </div>

                {/* State */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter state"
                  />
                </div>

                {/* Pincode */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-8 w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placingOrder
                  ? "Opening Payment..."
                  : "Proceed to Payment"}
              </button>
            </form>
          </div>

          {/* Order Summary */}

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-gray-500">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-gray-900">
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>

                  <span className="font-medium">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    ₹{finalTotalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 block text-center text-sm font-medium text-gray-600 hover:text-black hover:underline"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;