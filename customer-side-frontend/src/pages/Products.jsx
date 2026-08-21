import { useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      price: 799,
      category: "Fashion",
      store: "Fashion Store",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 2499,
      category: "Electronics",
      store: "Electronics Store",
    },
    {
      id: 3,
      name: "Modern Table Lamp",
      price: 1299,
      category: "Home",
      store: "Home & Living",
    },
    {
      id: 4,
      name: "Casual Sneakers",
      price: 1999,
      category: "Fashion",
      store: "Fashion Store",
    },
    {
      id: 5,
      name: "Smart Watch",
      price: 3499,
      category: "Electronics",
      store: "Electronics Store",
    },
    {
      id: 6,
      name: "Cotton Bedsheet",
      price: 999,
      category: "Home",
      store: "Home & Living",
    },
    {
      id: 7,
      name: "Running Shoes",
      price: 2299,
      category: "Sports",
      store: "Sports Store",
    },
    {
      id: 8,
      name: "Backpack",
      price: 1499,
      category: "Fashion",
      store: "Fashion Store",
    },
  ];

  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Home",
    "Sports",
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

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
                key={product.id}
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
              Try selecting a different category.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}

export default Products;