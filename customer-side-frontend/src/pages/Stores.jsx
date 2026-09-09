import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicStores } from "../services/api";

function Stores() {
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicStores();

        setStores(data.stores || []);
      } catch (err) {
        console.error("Failed to load stores:", err);
        setError(err.message || "Unable to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = useMemo(() => {
    if (selectedCategory === "all") {
      return stores;
    }

    return stores.filter(
      (store) => store.category === selectedCategory
    );
  }, [selectedCategory, stores]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-[#6B6F6D]">
          Loading stores...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#14201C]">
            Unable to load stores
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
            Explore
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">
            Discover Stores
          </h1>

          <p className="mt-4 max-w-2xl text-[#6B6F6D]">
            Explore different stores and discover products from vendors
            across the Zaalima marketplace.
          </p>

        </div>
      </section>

      {/* Stores */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#6B6F6D]">
            Showing{" "}
            <span className="font-semibold text-[#14201C]">
              {filteredStores.length}
            </span>{" "}
            {filteredStores.length === 1 ? "store" : "stores"}
          </p>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-[#E4E1D9] bg-white px-4 py-2.5 text-sm text-[#14201C] outline-none transition focus:border-[#B8892B] focus:ring-2 focus:ring-[#B8892B]/30"
          >
            {CATEGORIES.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>

        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-16 text-center">

            <p className="text-sm font-medium text-[#14201C]">
              No stores found.
            </p>

            <p className="mt-1 text-sm text-[#6B6F6D]">
              Try selecting a different category.
            </p>

          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredStores.map((store) => {
              const categoryColor =
                CATEGORY_COLORS[store.category] || "#6B6F6D";

              return (
                <div
                  key={store._id}
                  className="overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white transition hover:-translate-y-1 hover:border-[#B8892B]/40 hover:shadow-md"
                >

                  {/* Store Image */}
                  <div className="flex h-52 items-center justify-center overflow-hidden bg-[#FAFAF7]">

                    {store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-[#9A9D96]">
                        Store Image
                      </span>
                    )}

                  </div>

                  {/* Store Information */}
                  <div className="p-6">

                    {store.category && (
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{
                          backgroundColor: `${categoryColor}1F`,
                          color: categoryColor,
                        }}
                      >
                        {store.category}
                      </span>
                    )}

                    <h2 className="mt-4 text-xl font-semibold text-[#14201C]">
                      {store.name}
                    </h2>

                    {store.description && (
                      <p className="mt-2 text-sm leading-6 text-[#6B6F6D]">
                        {store.description}
                      </p>
                    )}

                    <Link
                      to={`/stores/${store.slug}`}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-[#0F2C27] hover:underline"
                    >
                      Visit Store
                      <span className="ml-1">→</span>
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