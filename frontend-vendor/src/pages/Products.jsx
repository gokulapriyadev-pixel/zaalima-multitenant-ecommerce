import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';
import Button from '../components/Button';

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSave = (product) => {
    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = product;
      setProducts(updated);
      setEditingIndex(null);
    } else {
      setProducts([...products, product]);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="products" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Products</h2>
            <Button onClick={() => { setEditingIndex(null); setModalOpen(true); }}>
              + Add Product
            </Button>
          </div>

          <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
        </main>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingIndex !== null ? products[editingIndex] : null}
      />
    </div>
  );
}

export default Products;