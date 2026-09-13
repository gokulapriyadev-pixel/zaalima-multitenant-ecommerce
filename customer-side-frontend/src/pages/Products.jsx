import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  getPublicStores,
  getAllPublicProducts,
} from "../services/api";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const storesData = await getPublicStores();
        const publicStores = storesData.stores || [];

        setStores(publicStores);

        const publicProducts =
          await getAllPublicProducts(publicStores);

        const productsWithStore = publicProducts.map((product) => {
          const store = publicStores.find(
            (item) =>
              item._id === product.storeId ||
              item._id === product.storeId?._id
          );

          return {
            ...product,
            store: store?.name || "Zaalima Store",
          };
        });

        setProducts(productsWithStore);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => {
        if (typeof product.categoryId === "object") {
          return product.categoryId?.name;
        }

        return product.category;
      })
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter((product) => {
      const category =
        typeof product.categoryId === "object"
          ? product.categoryId?.name
          : product.category;

      return category === selectedCategory;
    });
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-[#6B6F6D]">
          Loading products...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#14201C]">
            Unable to load products
          </h1>

          <p className="mt-3 text-sm text-[#6B6F6D]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">

      {/* Page Header */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
            Marketplace
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">
            All Products
          </h1>

          <p className="mt-4 max-w-2xl text-[#6B6F6D]">
            Discover products from different stores and find
            everything you need in one place.
          </p>

        </div>
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#0F2C27] text-white"
                    : "border border-[#E4E1D9] bg-white text-[#14201C] hover:bg-[#FAFAF7]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Count */}
          <p className="text-sm text-[#6B6F6D]">
            <span className="font-semibold text-[#14201C]">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-[#14201C]">
              No products found
            </h2>

            <p className="mt-2 text-sm text-[#6B6F6D]">
              There are currently no published products.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}

export default Products;