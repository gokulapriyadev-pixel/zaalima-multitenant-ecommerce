import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

function ProductFormModal({ isOpen, onClose, onSave, initialData, storeId }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inventoryCount, setInventoryCount] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.warn('Could not fetch categories for modal:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setInventoryCount(
        initialData.inventoryCount !== undefined
          ? String(initialData.inventoryCount)
          : initialData.stock !== undefined
          ? String(initialData.stock)
          : ''
      );
      setDescription(initialData.description || '');
      setImageUrl(initialData.images?.[0] || initialData.image || '');
      setCategoryId(initialData.categoryId?._id || initialData.categoryId || '');
      setIsPublished(initialData.isPublished !== false);
    } else {
      setName('');
      setPrice('');
      setInventoryCount('');
      setDescription('');
      setImageUrl('');
      setCategoryId('');
      setIsPublished(true);
    }
    setIsCreatingNewCategory(false);
    setNewCategoryName('');
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!price || Number(price) < 0) {
      setError('Valid price is required');
      return;
    }
    if (!description.trim()) {
      setError('Product description is required');
      return;
    }

    let finalCategoryId = categoryId || undefined;

    // Handle creating a new category inline if vendor typed one
    if (isCreatingNewCategory && newCategoryName.trim()) {
      try {
        const cleanCatSlug = newCategoryName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `category-${Date.now()}`;

        const catRes = await api.post('/categories', {
          storeId: storeId || initialData?.storeId,
          name: newCategoryName.trim(),
          slug: cleanCatSlug,
        });

        if (catRes.data?.category?._id) {
          finalCategoryId = catRes.data.category._id;
        }
      } catch (catErr) {
        setError(catErr.response?.data?.message || 'Failed to create new category');
        return;
      }
    }

    const cleanSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `product-${Date.now()}`;

    const imagesArray = imageUrl.trim() ? [imageUrl.trim()] : [];

    onSave({
      _id: initialData?._id,
      name: name.trim(),
      slug: initialData?.slug || cleanSlug,
      price: Number(price),
      inventoryCount: Number(inventoryCount || 0),
      description: description.trim(),
      categoryId: finalCategoryId,
      images: imagesArray,
      isPublished,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-bold">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name *"
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (₹) *"
              type="number"
              placeholder="e.g. 1999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Inventory Units *"
              type="number"
              placeholder="e.g. 25"
              value={inventoryCount}
              onChange={(e) => setInventoryCount(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Category
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNewCategory(!isCreatingNewCategory);
                  if (!isCreatingNewCategory) setCategoryId('');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {isCreatingNewCategory ? '← Choose from existing' : '+ Add new category'}
              </button>
            </div>

            {isCreatingNewCategory ? (
              <input
                type="text"
                placeholder="Enter new category name (e.g. Electronics)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full border border-blue-400 rounded-lg px-3 py-2 text-sm focus:border-blue-600 focus:outline-none bg-blue-50/20"
              />
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="">-- Select Category (Optional) --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {loadingCategories && (
              <p className="text-[11px] text-gray-400 mt-1">Loading categories...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Write a clear overview of product features and specs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/... or Cloudinary URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
              Publish immediately on marketplace
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <Button type="submit">
              {initialData ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;