import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';
import Button from '../components/Button';
import api from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchStoreAndProducts = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch current vendor's store
      let currentStore = null;
      try {
        const storeRes = await api.get('/stores/my-store');
        currentStore = storeRes.data.store;
        setStore(currentStore);
      } catch (storeErr) {
        console.warn("Could not find store:", storeErr);
      }

      // 2. Fetch vendor's products
      const prodRes = await api.get('/products');
      setProducts(prodRes.data.products || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreAndProducts();
  }, []);

  const handleSave = async (productData) => {
    try {
      if (selectedProduct && selectedProduct._id) {
        // Edit existing product
        await api.put(`/products/${selectedProduct._id}`, productData);
      } else {
        // Create new product
        const targetStoreId = store?._id;
        if (!targetStoreId) {
          alert('You must have an active store before creating products. Check Store Settings.');
          return;
        }

        await api.post('/products', {
          ...productData,
          storeId: targetStoreId,
        });
      }

      setModalOpen(false);
      setSelectedProduct(null);
      await fetchStoreAndProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${product._id}`);
      await fetchStoreAndProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="products" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Product Catalog Management" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your store listings, inventory counts, and pricing.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setModalOpen(true);
              }}
            >
              + Add Product
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-gray-500">Loading your product listings...</div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        initialData={selectedProduct}
      />
    </div>
  );
}

export default Products;