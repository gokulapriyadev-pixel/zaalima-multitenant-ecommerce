import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all, vendor, customer, super_admin

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || 'Could not load users directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [roleFilter, searchTerm]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
      case 'superadmin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Super Admin
          </span>
        );
      case 'vendor':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Vendor / Merchant
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Customer
          </span>
        );
    }
  };

  return (
    <AdminLayout
      activePage="users"
      title="Users Directory"
      subtitle="Audit, search, and monitor all registered accounts across Zaalima."
    >
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              roleFilter === 'all' 
                ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setRoleFilter('vendor')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              roleFilter === 'vendor' 
                ? 'bg-amber-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Vendors Only
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              roleFilter === 'customer' 
                ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customers Only
          </button>
          <button
            onClick={() => setRoleFilter('super_admin')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              roleFilter === 'super_admin' 
                ? 'bg-purple-600 text-white shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Super Admins
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchUsers} className="text-xs font-semibold underline hover:text-red-900">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading platform users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          <p className="text-base font-semibold text-gray-800">No registered users matched</p>
          <p className="text-xs mt-1 text-gray-400">Try modifying your search or switching role filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">User</th>
                  <th className="px-6 py-3.5 font-semibold">Email Address</th>
                  <th className="px-6 py-3.5 font-semibold">Assigned Role</th>
                  <th className="px-6 py-3.5 font-semibold">Account ID</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    {/* User Avatar + Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {user.name || 'Unnamed User'}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600 text-xs font-mono">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* User ID */}
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      {user._id}
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-gray-500 text-xs text-right">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>Showing {users.length} registered accounts</span>
            <span>Platform User Directory</span>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;
