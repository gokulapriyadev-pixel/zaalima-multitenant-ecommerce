import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';

function ProductFormModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [variants, setVariants] = useState(initialData?.variants || [{ label: '', stock: '' }]);
  const [images, setImages] = useState([]);

  if (!isOpen) return null;

  const addVariant = () => setVariants([...variants, { label: '', stock: '' }]);
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleSubmit = () => {
    onSave({ name, price, stock, variants, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {initialData ? 'Edit Product' : 'Add Product'}
        </h3>

        <div className="space-y-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Variants</label>
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  placeholder="e.g. Size M"
                  value={v.label}
                  onChange={(e) => updateVariant(i, 'label', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={() => removeVariant(i)} className="text-red-500 text-sm">
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addVariant} className="text-sm text-blue-600 font-medium">
              + Add Variant
            </button>
          </div>

          <ImageUploader onImagesChange={setImages} />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">
            Cancel
          </button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>
      </div>
    </div>
  );
}

export default ProductFormModal;