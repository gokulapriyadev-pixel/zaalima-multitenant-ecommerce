import { Link } from "react-router-dom";

function Stores() {
  const stores = [
    {
      id: 1,
      name: "Fashion Store",
      description: "Clothing, footwear and fashion accessories.",
      category: "Fashion",
    },
    {
      id: 2,
      name: "Electronics Store",
      description: "Smartphones, gadgets and electronic accessories.",
      category: "Electronics",
    },
    {
      id: 3,
      name: "Home & Living",
      description: "Furniture, decor and products for your home.",
      category: "Home",
    },
    {
      id: 4,
      name: "Beauty Store",
      description: "Beauty, skincare and personal care products.",
      category: "Beauty",
    },
    {
      id: 5,
      name: "Sports Store",
      description: "Sports equipment, fitness and outdoor products.",
      category: "Sports",
    },
    {
      id: 6,
      name: "Books & Stationery",
      description: "Books, notebooks and everyday stationery.",
      category: "Books",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Discover Stores
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Explore different stores and discover products from vendors
            across the Zaalima marketplace.
          </p>
        </div>
      </section>

      {/* Stores */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Search / Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {stores.length}
            </span>{" "}
            stores
          </p>

          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-black focus:ring-1 focus:ring-black"
            defaultValue="all"
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home</option>
            <option value="beauty">Beauty</option>
            <option value="sports">Sports</option>
            <option value="books">Books</option>
          </select>

        </div>

        {/* Store Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {stores.map((store) => (
            <div
              key={store.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Store Image */}
              <div className="flex h-52 items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  Store Image
                </span>
              </div>

              {/* Store Information */}
              <div className="p-6">

                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {store.category}
                </span>

                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {store.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {store.description}
                </p>

                <Link
                  to={`/stores/${store.id}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-gray-900 hover:underline"
                >
                  Visit Store
                  <span className="ml-1">→</span>
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Stores;