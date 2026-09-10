import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndStores = async () => {
      try {
        // 1. Get public active stores first
        const storeRes = await api.get('/stores/public');
        const stores = storeRes.data.stores || [];

        // 2. Fetch published products for all active stores
        let allProducts = [];
        for (const store of stores) {
          const prodRes = await api.get(`/products/store/${store._id}`);
          const storeProducts = (prodRes.data.products || []).map(p => ({
            ...p,
            id: p._id, // map MongoDB _id to frontend id
            store: store.name
          }));
          allProducts = [...allProducts, ...storeProducts];
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching dynamic products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndStores();
  }, []);

  const categories = ["All", "Fashion", "Electronics", "Home", "Sports"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.name === selectedCategory ||
            product.category === selectedCategory ||
            product.categoryId?.name === selectedCategory
        );

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">Marketplace</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">All Products</h1>
          <p className="mt-4 max-w-2xl text-[#6B6F6D]">
            Discover live products uploaded from vendor stores across the platform.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === category
                    ? "bg-[#0F2C27] text-white"
                    : "border border-[#E4E1D9] bg-white text-[#6B6F6D] hover:border-[#14201C] hover:text-[#14201C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center py-20 text-gray-500">Loading products from stores...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-[#14201C]">No products found</h2>
            <p className="mt-2 text-sm text-[#6B6F6D]">Try creating a product from your vendor dashboard first.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;