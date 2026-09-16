import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getStoreBySlug,
  getStoreProducts,
} from "../services/api";
import ProductCard from "../components/ProductCard";

function StoreDetails() {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET STORE + PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get store using public slug
        const storeData = await getStoreBySlug(slug);

        const currentStore = storeData.store;

        setStore(currentStore);

        // Get products belonging to this store
        const productData = await getStoreProducts(currentStore._id);

        setProducts(productData.products || []);
      } catch (err) {
        console.error("Failed to load store:", err);

        setError(
          err.message || "Unable to load store"
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStoreDetails();
    }
  }, [slug]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <p className="text-sm text-[#6B6F6D]">
            Loading store...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">

          <h1 className="font-serif text-3xl text-[#14201C]">
            Unable to load store
          </h1>

          <p className="mt-3 text-[#6B6F6D]">
            {error || "Store not found"}
          </p>

          <Link
            to="/stores"
            className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            Back to Stores
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================
  // STORE DETAILS
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FAFAF7]">

      {/* Store Header */}
      <section className="border-b border-[#E4E1D9] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-[#6B6F6D]">

            <Link
              to="/"
              className="hover:text-[#0F2C27]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/stores"
              className="hover:text-[#0F2C27]"
            >
              Stores
            </Link>

            <span>/</span>

            <span className="text-[#14201C]">
              {store.name}
            </span>

          </div>

          {/* Store Information */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Store Logo */}
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-[#FAFAF7]">

              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[#9A9D96]">
                  Store Image
                </span>
              )}

            </div>

            {/* Store Details */}
            <div className="lg:col-span-2">

              <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
                Zaalima Store
              </p>

              <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#14201C]">
                {store.name}
              </h1>

              {store.description && (
                <p className="mt-5 max-w-2xl leading-7 text-[#6B6F6D]">
                  {store.description}
                </p>
              )}

              {store.contactEmail && (
                <p className="mt-4 text-sm text-[#6B6F6D]">
                  Contact:{" "}
                  <span className="font-medium text-[#14201C]">
                    {store.contactEmail}
                  </span>
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">

                <span className="rounded-full bg-[#0F2C27]/5 px-4 py-2 text-sm font-medium text-[#0F2C27]">
                  Active Store
                </span>

                <span className="rounded-full bg-[#B8892B]/10 px-4 py-2 text-sm font-medium text-[#8A691F]">
                  {products.length} Products
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
            Shop
          </p>

          <h2 className="mt-2 font-serif text-3xl text-[#14201C]">
            Products from {store.name}
          </h2>

          <p className="mt-3 text-[#6B6F6D]">
            Browse products available from this store.
          </p>

        </div>

        {/* No Products */}
        {products.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-[#E4E1D9] bg-white px-6 py-16 text-center">

            <h3 className="text-lg font-semibold text-[#14201C]">
              No products available
            </h3>

            <p className="mt-2 text-sm text-[#6B6F6D]">
              This store currently has no published products.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  storeId: store._id,
                  storeName: store.name,
                  store: store.name,
                }}
              />
            ))}
          </div>

        )}

      </section>

    </main>
  );
}

export default StoreDetails;