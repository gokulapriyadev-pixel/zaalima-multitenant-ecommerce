import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin } from "lucide-react";
import api from "../services/api";

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {

      try {
        if (!id) return;
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAF7] px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-[#6B6F6D]">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-16 flex items-center justify-center">
      <div className="mx-auto w-full max-w-2xl bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E1D9] shadow-sm text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <CheckCircle2 size={44} strokeWidth={2.2} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-[#B8892B]">
          Payment Confirmed
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#14201C]">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#6B6F6D] max-w-lg mx-auto">
          Your payment was processed successfully. We've notified the vendor, and your items will be prepared for dispatch soon.
        </p>

        {/* Order Reference Box */}
        <div className="mt-8 rounded-2xl bg-[#FAFAF7] border border-[#E4E1D9] p-5 text-left space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-[#E4E1D9]/60 pb-3">
            <span className="text-[#6B6F6D]">Order ID</span>
            <span className="font-mono font-semibold text-[#14201C] text-xs sm:text-sm">
              {id}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-[#E4E1D9]/60 pb-3">
            <span className="text-[#6B6F6D]">Payment Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {order?.paymentStatus ? order.paymentStatus.toUpperCase() : "PAID"}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between items-center text-sm border-b border-[#E4E1D9]/60 pb-3">
                <span className="text-[#6B6F6D]">Total Amount</span>
                <span className="font-bold text-[#14201C] text-base">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>

              {order.shippingAddress && (
                <div className="pt-1 text-xs sm:text-sm text-[#6B6F6D]">
                  <span className="font-medium text-[#14201C] flex items-center gap-1.5 mb-1">
                    <MapPin size={15} /> Delivery Destination:
                  </span>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2C27] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#123832]"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link
            to="/stores"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E1D9] bg-white px-6 py-3.5 text-sm font-semibold text-[#14201C] transition hover:bg-[#FAFAF7]"
          >
            Explore Other Stores
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
