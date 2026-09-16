import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectAppliedCoupon,
  selectDiscountAmount,
  selectFinalTotalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../redux/cartSlice";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const discountAmount = useSelector(selectDiscountAmount);
  const finalTotalPrice = useSelector(selectFinalTotalPrice);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const targetStoreId =
    cartItems[0]?.storeId || cartItems[0]?.store?._id || cartItems[0]?.store;
  const storeName = cartItems[0]?.storeName || "Store";

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

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
        code: couponInput.trim().toUpperCase(),
      });

      dispatch(
        applyCoupon({
          code: res.data.code,
          discountType: res.data.discountType,
          discountValue: res.data.discountValue,
        })
      );

      setCouponSuccess(`Coupon "${res.data.code}" applied successfully!`);
      setCouponInput("");
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

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAF7] px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-[#E4E1D9] bg-white px-6 py-20 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2C27]/5 text-[#0F2C27] mb-6">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#14201C]">
              Your Cart is Empty
            </h1>
            <p className="mt-3 text-sm text-[#6B6F6D] max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Explore our curated merchant stores and discover amazing items.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2C27] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#123832]"
              >
                Browse Products
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/stores"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E1D9] bg-white px-6 py-3.5 text-sm font-semibold text-[#14201C] transition hover:bg-[#FAFAF7]"
              >
                Explore Stores
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-16">
      {/* Header Banner */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B8892B]">
              Fulfillment from {storeName}
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl tracking-tight text-[#14201C]">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-[#6B6F6D]">
              Review your items, apply store coupons, and proceed to checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your cart?")) {
                dispatch(clearCart());
              }
            }}
            className="self-start sm:self-auto text-xs font-semibold text-red-600 hover:text-red-700 underline"
          >
            Clear All Items
          </button>
        </div>
      </section>

      {/* Cart Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Items List */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-[#E4E1D9] bg-white divide-y divide-[#E4E1D9]/60 shadow-sm overflow-hidden">
              {cartItems.map((item) => {
                const itemId = item.id || item._id;
                const itemStock = item.stock ?? 10;
                const isMaxReached = item.quantity >= itemStock;

                return (
                  <div
                    key={itemId}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition hover:bg-[#FAFAF7]/50"
                  >
                    {/* Item Image + Details */}
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-[#FAFAF7] border border-[#E4E1D9] shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B8892B] block">
                          {item.storeName || storeName}
                        </span>
                        <Link
                          to={`/products/${itemId}`}
                          className="font-serif font-semibold text-base sm:text-lg text-[#14201C] hover:text-[#0F2C27] truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#6B6F6D] mt-0.5">
                          Unit Price: ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </p>
                        {itemStock <= 5 && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Only {itemStock} left in stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls + Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Counter */}
                      <div className="flex items-center rounded-xl border border-[#E4E1D9] bg-[#FAFAF7]">
                        <button
                          type="button"
                          onClick={() => dispatch(decreaseQuantity(itemId))}
                          disabled={item.quantity <= 1}
                          className="p-2 text-[#14201C] hover:bg-white rounded-l-xl transition disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3.5 py-1 text-sm font-semibold text-[#14201C] min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(increaseQuantity(itemId))}
                          disabled={isMaxReached}
                          className="p-2 text-[#14201C] hover:bg-white rounded-r-xl transition disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[5.5rem]">
                        <p className="text-base font-bold text-[#14201C]">
                          ₹{(Number(item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon Box */}
          <div className="space-y-6">
            {/* Coupon Code Card */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={18} className="text-[#B8892B]" />
                <h3 className="font-semibold text-sm text-[#14201C]">
                  Store Discount Coupon
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <CheckCircle2 size={14} />
                      {appliedCoupon.code} Applied
                    </div>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {appliedCoupon.discountType === "percentage"
                        ? `${appliedCoupon.discountValue}% discount applied`
                        : `₹${appliedCoupon.discountValue} flat discount applied`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 rounded-xl border border-[#E4E1D9] px-3.5 py-2 text-xs uppercase font-medium placeholder-gray-400 outline-none focus:border-[#B8892B]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="rounded-xl bg-[#0F2C27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#123832] disabled:opacity-50 transition"
                    >
                      {couponLoading ? "Validating..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={13} /> {couponError}
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> {couponSuccess}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#14201C] pb-2 border-b border-[#E4E1D9]">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-[#6B6F6D]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-[#14201C]">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B6F6D]">
                  <span>Estimated Delivery</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E1D9] flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-[#14201C]">Total Amount</span>
                  <p className="text-[11px] text-[#6B6F6D]">Includes all applicable taxes</p>
                </div>
                <span className="text-2xl font-bold text-[#0F2C27]">
                  ₹{finalTotalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2C27] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#123832] shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              <Link
                to="/products"
                className="block text-center text-xs font-semibold text-[#6B6F6D] hover:text-[#14201C] transition pt-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart;