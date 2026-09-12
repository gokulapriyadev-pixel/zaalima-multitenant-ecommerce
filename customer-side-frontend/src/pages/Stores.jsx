import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import api from "../services/api";

function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await api.get('/stores/public');
        setStores(data.stores || []);
      } catch (err) {
        console.error("Failed to load stores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "Fashion", label: "Fashion" },
    { value: "Electronics", label: "Electronics" },
    { value: "Home", label: "Home" },
    { value: "Beauty", label: "Beauty" },
    { value: "Sports", label: "Sports" },
    { value: "Books", label: "Books" },
  ];

  const CATEGORY_COLORS = {
    Fashion: "#C97B63",
    Electronics: "#5B7A8C",
    Home: "#7A8F6E",
    Beauty: "#A6708C",
    Sports: "#B5714A",
    Books: "#7A6A8C",
  };

  // Filter stores based on category and live search term
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // Category filter
      if (selectedCategory !== "all" && store.category !== selectedCategory) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const nameMatch = store.name?.toLowerCase().includes(term);
        const descMatch = store.description?.toLowerCase().includes(term);
        const slugMatch = store.slug?.toLowerCase().includes(term);

        if (!nameMatch && !descMatch && !slugMatch) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, stores, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* Header Banner */}
      <section className="border-b border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
            Explore
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">
            Discover Stores
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[#6B6F6D]">
            Explore different stores and discover products from vendors
            across the Zaalima marketplace.
          </p>
        </div>
      </section>

      {/* Stores Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md flex items-center">
            <Search size={17} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stores by name, keyword, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#E4E1D9] bg-white pl-10 pr-10 py-2.5 text-sm text-[#14201C] outline-none transition focus:border-[#B8892B] focus:ring-2 focus:ring-[#B8892B]/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-[#6B6F6D]">
              Showing <strong className="text-[#14201C]">{filteredStores.length}</strong> {filteredStores.length === 1 ? "store" : "stores"}
            </p>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-[#E4E1D9] bg-white px-4 py-2.5 text-xs font-semibold text-[#14201C] outline-none transition focus:border-[#B8892B] focus:ring-2 focus:ring-[#B8892B]/20"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Store Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-16 text-center">
            <p className="text-base font-semibold text-[#14201C]">
              No stores found
            </p>
            <p className="mt-1.5 text-sm text-[#6B6F6D]">
              {searchTerm
                ? `No stores matched your search "${searchTerm}".`
                : "No stores found in this category."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 rounded-lg bg-[#0F2C27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#123832] transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStores.map((store) => {
              const storeId = store._id || store.id;

              return (
                <div
                  key={storeId}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white transition hover:-translate-y-1 hover:border-[#B8892B]/40 hover:shadow-md"
                >
                  <div>
                    {/* Store Logo Banner */}
                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#FAFAF7]">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#9A9D96]">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E1D9]">
                            <span className="font-serif text-lg font-bold text-[#14201C]">
                              {store.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs">No Store Image</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      {store.category && (
                        <span
                          className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[store.category] || "#0F2C27",
                          }}
                        >
                          {store.category}
                        </span>
                      )}
                    </div>

                    {/* Store Info */}
                    <div className="p-6">
                      <h2 className="font-serif text-xl font-semibold text-[#14201C] group-hover:text-[#B8892B] transition">
                        {store.name}
                      </h2>

                      <p className="mt-2 text-sm text-[#6B6F6D] line-clamp-2">
                        {store.description ||
                          "Explore unique products curated by this vendor."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-[#E4E1D9]/60 px-6 py-4 bg-[#FAFAF7]/50 flex items-center justify-between">
                    <span className="text-xs text-[#9A9D96]">
                      /{store.slug}
                    </span>
                    <Link
                      to={`/products?store=${storeId}&storeName=${encodeURIComponent(store.name)}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F2C27] hover:text-[#B8892B] transition"
                    >
                      Visit Store →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Stores;