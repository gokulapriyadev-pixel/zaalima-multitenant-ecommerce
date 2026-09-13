import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  // Form State for creating new coupon
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [maxUses, setMaxUses] = useState('0');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/coupons/my-store');
      setCoupons(res.data || []);
    } catch (err) {
      console.error('Failed to load store coupons:', err);
      setError(err.response?.data?.message || 'Failed to load store coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    // Default expiry date 30 days from now
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    setExpiryDate(nextMonth.toISOString().split('T')[0]);
    setMaxUses('0');
    setFormError('');
    setModalOpen(true);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setFormError('Valid discount value is required.');
      return;
    }
    if (discountType === 'percentage' && Number(discountValue) > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }
    if (!expiryDate) {
      setFormError('Expiry date is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');

      await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        maxUses: Number(maxUses || 0),
      });

      setModalOpen(false);
      await fetchCoupons();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await api.patch(`/coupons/${coupon._id}/toggle`);
      await fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update coupon status.');
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      return;
    }

    try {
      await api.delete(`/coupons/${coupon._id}`);
      await fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="coupons" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Coupons & Promotions Management" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Store Coupons</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Create and manage promo codes, discount rates, expiry dates, and usage limits.
              </p>
            </div>
            <Button onClick={handleOpenModal}>
              + Create Coupon
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="p-16 text-center text-gray-500">Loading your store coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
              <p className="text-base font-semibold text-gray-700">No coupons created yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "+ Create Coupon" above to offer promotional discounts to your customers.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Code</th>
                      <th className="px-5 py-3">Discount</th>
                      <th className="px-5 py-3">Usage</th>
                      <th className="px-5 py-3">Expires On</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {coupons.map((c) => {
                      const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                      const isLimitReached = c.maxUses > 0 && c.timesUsed >= c.maxUses;

                      return (
                        <tr key={c._id} className="hover:bg-gray-50/60 transition">
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-gray-900 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs">
                              {c.code}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-gray-800">
                            {c.discountType === 'percentage'
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue.toLocaleString('en-IN')} OFF`}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {c.timesUsed}{' '}
                            <span className="text-gray-400">
                              / {c.maxUses === 0 ? 'Unlimited' : c.maxUses}
                            </span>
                            {isLimitReached && (
                              <span className="ml-2 text-xs text-amber-600 font-semibold">(Limit reached)</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            {c.expiryDate ? (
                              <span className={isExpired ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                                {new Date(c.expiryDate).toLocaleDateString()}
                                {isExpired && ' (Expired)'}
                              </span>
                            ) : (
                              <span className="text-gray-400">Never</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                c.isActive && !isExpired && !isLimitReached
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {c.isActive && !isExpired && !isLimitReached ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(c)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition ${
                                c.isActive
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {c.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(c)}
                              className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline px-1 py-1"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Create New Store Coupon</h3>
            <p className="text-xs text-gray-500 mb-4">
              Set discount rules and limits for your promotion code.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase font-mono tracking-wider focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {discountType === 'percentage' ? 'Discount %' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    placeholder={discountType === 'percentage' ? '15' : '100'}
                    required
                    min="1"
                    max={discountType === 'percentage' ? '100' : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Uses (0 = unlimited)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
