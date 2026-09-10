import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems, selectCartTotalPrice, clearCart } from "../redux/cartSlice";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const [address, setAddress] = useState({
    street: "", city: "", state: "", zipCode: "", country: "India"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const targetStoreId = cartItems[0]?.storeId || cartItems[0]?.store?._id || cartItems[0]?.store;
      if (!targetStoreId) {
        throw new Error("Unable to identify store for this order. Please re-add item to cart.");
      }

      // 1. Create Order in Backend
      const orderRes = await api.post('/orders', {
        storeId: targetStoreId,
        products: cartItems.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity
        })),
        shippingAddress: address
      });

      const mongoOrderId = orderRes.data.order._id;

      // 2. Create Razorpay Payment Order
      const razorpayRes = await api.post('/payments/create-order', { orderId: mongoOrderId });
      const { order: razorpayOrder } = razorpayRes.data;

      // 3. Open Razorpay Checkout Modal
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

      let customerEmail = "customer@example.com";
      let customerName = "Valued Customer";
      try {
        const savedCustomer = JSON.parse(localStorage.getItem('customerInfo') || '{}');
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
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            dispatch(clearCart());
            navigate(`/order-success/${mongoOrderId}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || "Payment verification failed. Contact support.");
          }
        },
        prefill: { name: customerName, email: customerEmail },
        theme: { color: "#0F2C27" }
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-10">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-2xl border border-[#E4E1D9] shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Shipping & Checkout</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleCheckout} className="space-y-4">
          <input type="text" placeholder="Street Address" required className="w-full p-3 border rounded-lg"
            value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" required className="p-3 border rounded-lg"
              value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
            <input type="text" placeholder="State" required className="p-3 border rounded-lg"
              value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Zip Code" required className="p-3 border rounded-lg"
              value={address.zipCode} onChange={e => setAddress({ ...address, zipCode: e.target.value })} />
            <input type="text" placeholder="Country" required className="p-3 border rounded-lg"
              value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-bold">Total: ₹{totalPrice.toLocaleString("en-IN")}</span>
            <button type="submit" disabled={loading} className="bg-[#0F2C27] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#123832]">
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;