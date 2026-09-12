import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeFilter = searchParams.get("store");
  const storeNameFilter = searchParams.get("storeName");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);

        // 1. Fetch public active stores
        const storeRes = await api.get('/stores/public');
        const stores = storeRes.data.stores || [];

        // 2. Fetch products for all active stores
        let allProducts = [];
        for (const store of stores) {
          try {
            const prodRes = await api.get(`/products/store/${store._id}`);
            const storeProducts = (prodRes.data.products || []).map((p) => ({
              ...p,
              id: p._id,
              store: store.name,
              storeId: store._id,
            }));
            allProducts = [...allProducts, ...storeProducts];
          } catch (pErr) {
            console.warn(`Could not load products for store ${store._id}:`, pErr);
          }
        }

        setProducts(allProducts);

        // 3. Fetch public categories or extract unique categories from loaded products
        try {
          const catRes = await api.get('/categories/public');
          const catNames = (catRes.data.categories || []).map((c) => c.name);
          const productCatNames = allProducts
            .map((p) => p.categoryId?.name || p.category?.name || p.category)
            .filter(Boolean);
          const uniqueCats = ["All", ...new Set([...catNames, ...productCatNames, "Fashion", "Electronics", "Home"])];
          setCategories(uniqueCats);
        } catch {
          const productCatNames = allProducts
            .map((p) => p.categoryId?.name || p.category?.name || p.category)
            .filter(Boolean);
          const fallbackCats = ["All", ...new Set([...productCatNames, "Fashion", "Electronics", "Home", "Sports"])];
          setCategories(fallbackCats);
        }
      } catch (err) {
        console.error("Error fetching dynamic products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Filter products by Store, Category, and Real-time Search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Store Filter
      if (storeFilter) {
        const pStoreId = product.storeId?._id || product.storeId;
        if (String(pStoreId) !== String(storeFilter)) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "All") {
        const pCatName =
          product.categoryId?.name ||
          product.category?.name ||
          product.category;
        if (pCatName !== selectedCategory) {
          return false;
        }
      }

      // 3. Search Term Filter (name, description, store name)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const nameMatch = product.name?.toLowerCase().includes(term);
        const descMatch = product.description?.toLowerCase().includes(term);
        const storeName = (product.storeId?.name || product.store || "").toLowerCase();
        const storeMatch = storeName.includes(term);

        if (!nameMatch && !descMatch && !storeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [products, storeFilter, selectedCategory, searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* Header Banner */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">Marketplace</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">
            {storeNameFilter ? `${storeNameFilter}'s Catalog` : "All Products"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#6B6F6D]">
            {storeNameFilter
              ? `Browsing exclusive items directly curated by ${storeNameFilter}.`
              : "Discover live products uploaded from vendor stores across the platform."}
          </p>

          {/* Active Store Filter Badge */}
          {storeFilter && (
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F2C27]/10 px-3 py-1 text-xs font-semibold text-[#0F2C27]">
                Filtered by store: {storeNameFilter || storeFilter}
              </span>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="text-xs font-semibold text-red-600 underline hover:text-red-800"
              >
                Clear store filter
              </button>
            </div>
          )}

          {/* Real-time Search Input */}
          <div className="mt-6 max-w-xl">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by title, description, or store name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#E4E1D9] bg-[#FAFAF7] pl-10 pr-10 py-3 text-sm text-[#14201C] outline-none transition focus:border-[#0F2C27] focus:bg-white focus:ring-2 focus:ring-[#0F2C27]/10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === category
                    ? "bg-[#0F2C27] text-white shadow-sm"
                    : "border border-[#E4E1D9] bg-white text-[#6B6F6D] hover:border-[#14201C] hover:text-[#14201C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 text-sm text-[#6B6F6D]">
          <p>
            Showing <strong className="text-[#14201C]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>

          {(searchTerm || selectedCategory !== "All" || storeFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
            <p className="mt-3 text-sm text-[#6B6F6D]">Loading products from stores...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white py-16 px-4 text-center">
            <h2 className="text-xl font-semibold text-[#14201C]">No products found</h2>
            <p className="mt-2 text-sm text-[#6B6F6D] max-w-md mx-auto">
              {searchTerm
                ? `No products matched "${searchTerm}". Try checking your spelling or searching a different term.`
                : "No products available in this selection."}
            </p>
            {(searchTerm || selectedCategory !== "All" || storeFilter) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 rounded-lg bg-[#0F2C27] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#123832] transition"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;