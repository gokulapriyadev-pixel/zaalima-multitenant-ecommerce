import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, suspended
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/stores');
      setStores(res.data || []);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setError(err.response?.data?.message || 'Could not load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleToggleStatus = async (store) => {
    const actionName = store.isActive ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionName} "${store.name}"?`)) {
      return;
    }

    try {
      setActionLoadingId(store._id);

      // Optimistic update
      setStores(prev => prev.map(s => 
        s._id === store._id ? { ...s, isActive: !s.isActive } : s
      ));

      const res = await api.put(`/admin/stores/${store._id}/status`);
      
      // Update with server returned store object
      if (res.data?.store) {
        setStores(prev => prev.map(s => 
          s._id === store._id ? { ...s, isActive: res.data.store.isActive } : s
        ));
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert(err.response?.data?.message || `Failed to ${actionName} store.`);
      // Revert back
      fetchStores();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtering
  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.ownerId?.email && store.ownerId.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.ownerId?.name && store.ownerId.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? store.isActive :
      !store.isActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      activePage="stores"
      title="Store Moderation"
      subtitle="Supervise, audit, and activate or suspend merchant tenant stores."
    >
      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by store name, slug, or owner email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Stores ({stores.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              statusFilter === 'active' 
                ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({stores.filter(s => s.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              statusFilter === 'suspended' 
                ? 'bg-red-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suspended ({stores.filter(s => !s.isActive).length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStores} className="text-xs font-semibold underline hover:text-red-900">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading store directory...</p>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          <p className="text-base font-semibold text-gray-800">No stores found</p>
          <p className="text-xs mt-1 text-gray-400">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Store Details</th>
                  <th className="px-6 py-3.5 font-semibold">Merchant / Owner</th>
                  <th className="px-6 py-3.5 font-semibold">Created Date</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStores.map((store) => (
                  <tr key={store._id} className="hover:bg-gray-50 transition-colors">
                    {/* Store Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {store.logoUrl ? (
                          <img 
                            src={store.logoUrl} 
                            alt={store.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                            {store.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {store.name}
                            <button
                              onClick={() => setSelectedStore(store)}
                              className="text-[11px] text-blue-600 hover:underline font-normal"
                            >
                              Audit Info
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            /{store.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner Info */}
                    <td className="px-6 py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {store.ownerId?.name || 'Unknown Owner'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {store.ownerId?.email || 'No email associated'}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(store.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        store.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${store.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {store.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* 1-Click Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(store)}
                        disabled={actionLoadingId === store._id}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                          store.isActive
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        } disabled:opacity-50`}
                      >
                        {actionLoadingId === store._id ? (
                          'Updating...'
                        ) : store.isActive ? (
                          'Suspend Store'
                        ) : (
                          'Activate Store'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Store Quick Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Store Profile Audit</h3>
              <button 
                onClick={() => setSelectedStore(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Store Name</span>
                <span className="font-semibold text-gray-900">{selectedStore.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Slug Identifier</span>
                <span className="font-mono text-blue-600">/{selectedStore.slug}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Description</span>
                <span className="text-right max-w-xs">{selectedStore.description || 'No description entered'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Owner ID</span>
                <span className="font-mono text-gray-500">{selectedStore.ownerId?._id || selectedStore.ownerId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Owner Contact</span>
                <span>{selectedStore.ownerId?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Current Moderation State</span>
                <span className={selectedStore.isActive ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                  {selectedStore.isActive ? 'Active on Marketplace' : 'Suspended (Hidden from Public)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStore(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminStores;
