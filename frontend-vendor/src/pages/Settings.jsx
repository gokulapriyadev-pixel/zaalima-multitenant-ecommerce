import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

function Settings() {
  const [store, setStore] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStore = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/stores/my-store');
      const s = res.data.store;
      if (s) {
        setStore(s);
        setName(s.name || '');
        setSlug(s.slug || '');
        setDescription(s.description || '');
        setContactEmail(s.contactEmail || '');
        setLogoUrl(s.logoUrl || '');
      }
    } catch (err) {
      console.warn("Store fetch note:", err.response?.data?.message || err.message);
      // If store doesn't exist yet, allow them to create one
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (store) {
        // Update existing store via PUT /api/stores/my-store
        const res = await api.put('/stores/my-store', {
          name,
          slug,
          description,
          contactEmail,
          logoUrl,
        });
        setStore(res.data.store);
        setMessage('Store details updated successfully!');
      } else {
        // Create new store via POST /api/stores
        const res = await api.post('/stores', {
          name,
          slug,
          description,
          contactEmail,
          logoUrl,
        });
        setStore(res.data.store);
        setMessage('Store created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save store settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Store Settings" />
        <main className="flex-1 overflow-y-auto p-6 max-w-4xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {store ? 'Store Profile & Branding' : 'Setup Your Store'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your public storefront branding, slug, and contact email.
            </p>
          </div>

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl mb-6 text-sm">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              ✕ {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading store settings...</div>
          ) : (
            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <Input
                label="Store Name *"
                placeholder="e.g. Apex Sportswear"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Store Slug (URL identifier) *"
                placeholder="e.g. apex-sportswear"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your brand and what makes your products unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="contact@yourstore.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />

                <Input
                  label="Logo Image URL"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : store ? 'Save Changes' : 'Create Store'}
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
