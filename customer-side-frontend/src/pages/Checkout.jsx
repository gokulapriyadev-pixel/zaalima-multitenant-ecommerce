import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectAppliedCoupon,
  selectDiscountAmount,
  selectFinalTotalPrice,
  applyCoupon,
  removeCoupon,
  clearCart,
} from "../redux/cartSlice";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const discountAmount = useSelector(selectDiscountAmount);
  const finalTotalPrice = useSelector(selectFinalTotalPrice);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const uniqueStoreIds = [...new Set(cartItems.map((item) => item.storeId).filter(Boolean))];
  const isMultiStoreConflict = uniqueStoreIds.length > 1;
  const storeName = cartItems[0]?.storeName || "Store";
  const targetStoreId = cartItems[0]?.storeId || cartItems[0]?.store?._id || cartItems[0]?.store;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    if (!targetStoreId) {
      setCouponError("Unable to identify store for coupon validation.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponSuccess("");

      const res = await api.post("/coupons/validate", {
        storeId: targetStoreId,
        code: couponCodeInput.trim().toUpperCase(),
      });

      dispatch(
        applyCoupon({
          code: res.data.code,
          discountType: res.data.discountType,
          discountValue: res.data.discountValue,
        })
      );

      setCouponSuccess(`Coupon "${res.data.code}" applied!`);
      setCouponCodeInput("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid or expired coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccess("");
    setCouponError("");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (isMultiStoreConflict) {
      setError("Your cart contains items from multiple stores. Please return to your cart and resolve before checking out.");
      return;
    }

    if (!targetStoreId) {
      setError("Unable to identify store for this order. Please re-add item to cart.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Order in Backend with couponCode
      const orderPayload = {
        storeId: targetStoreId,
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
      };

      if (appliedCoupon?.code) {
        orderPayload.couponCode = appliedCoupon.code;
      }

      const orderRes = await api.post("/orders", orderPayload);
      const mongoOrderId = orderRes.data.order._id;

      // 2. Create Razorpay Payment Order
      const razorpayRes = await api.post("/payments/create-order", { orderId: mongoOrderId });
      const { order: razorpayOrder } = razorpayRes.data;

      // 3. Open Razorpay Checkout Modal
      const razorpayKey = razorpayRes.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TPwn3pNGAEgMkL";

      let customerEmail = "customer@example.com";
      let customerName = "Valued Customer";
      try {
        const savedCustomer = JSON.parse(localStorage.getItem("customerInfo") || "{}");
        if (savedCustomer.email) customerEmail = savedCustomer.email;
        if (savedCustomer.name) customerName = savedCustomer.name;
      } catch {
        // ignore JSON parse errors
      }

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Zaalima Marketplace",
        description: `Order #${mongoOrderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            dispatch(clearCart());
            navigate(`/order-success/${mongoOrderId}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || "Payment verification failed. Contact support.");
          }
        },
        prefill: { name: customerName, email: customerEmail },
        theme: { color: "#0F2C27" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        setError(response.error?.description || "Payment was rejected or cancelled.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Checkout failed.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAF7] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-2.5 text-sm font-semibold text-white">
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-10">
      <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-5">
        {/* Left Column: Shipping Details Form */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl border border-[#E4E1D9] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#14201C]">Shipping Address</h1>
            {!isMultiStoreConflict && (
              <span className="text-xs font-semibold text-[#B8892B] bg-[#B8892B]/10 px-3 py-1 rounded-full">
                Store: {storeName}
              </span>
            )}
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {isMultiStoreConflict && (
            <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              Notice: Items from multiple stores detected in cart. Please return to Cart to isolate your order to a single store.
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="123 Main Street, Apt 4"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  placeholder="110001"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="India"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isMultiStoreConflict}
              className="mt-6 w-full bg-[#0F2C27] text-white py-3.5 rounded-xl font-semibold hover:bg-[#123832] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 transition"
            >
              {loading ? "Processing Order..." : `Pay ₹${finalTotalPrice.toLocaleString("en-IN")} with Razorpay`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E4E1D9] shadow-sm">
            <h2 className="text-lg font-bold text-[#14201C] mb-4">Order Summary</h2>

            {/* Items mini list */}
            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Application Box */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Promo / Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="ml-1 text-emerald-700">
                      ({appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="font-bold text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs uppercase placeholder:normal-case focus:border-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCodeInput.trim()}
                    className="shrink-0 rounded-lg bg-[#0F2C27] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#123832] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}

              {couponError && <p className="mt-1.5 text-xs text-red-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="mt-1.5 text-xs text-emerald-600 font-medium">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-[#14201C]">
                <span>Total</span>
                <span className="text-lg">₹{finalTotalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;