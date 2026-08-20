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
    <main className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Marketplace
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
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
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Count */}
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
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
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try selecting a different category.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}

export default Products;