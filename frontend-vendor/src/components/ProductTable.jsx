function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Variants</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-4 py-3">
                {p.images && p.images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(p.images[0])}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
              <td className="px-4 py-3">${p.price}</td>
              <td className="px-4 py-3">{p.stock}</td>
              <td className="px-4 py-3">{p.variants?.length || 0} variant(s)</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(i)} className="text-blue-600 mr-3">Edit</button>
                <button onClick={() => onDelete(i)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;