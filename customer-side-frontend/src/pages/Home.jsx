import { Link } from "react-router-dom";


const Home = () => {
  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-gray-100">
        <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Hero Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Discover • Shop • Enjoy
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
              Discover products from stores you love.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Explore multiple stores, discover amazing products, and enjoy
              a simple shopping experience — all from one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Shop Products
              </Link>

              <Link
                to="/stores"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Explore Stores
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex h-[400px] w-full max-w-[500px] items-center justify-center rounded-2xl bg-gray-200">
              <span className="text-sm font-medium text-gray-500">
                Hero Image
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* ================= FEATURED STORES ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Featured Stores
            </h2>
          </div>

          <Link
            to="/stores"
            className="hidden text-sm font-semibold text-gray-900 hover:underline sm:block"
          >
            View All Stores →
          </Link>
        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-400">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Fashion Store
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Fashion, clothing and accessories.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-gray-900 hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>


          <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-400">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Electronics Store
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Gadgets, electronics and accessories.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-gray-900 hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>


          <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-400">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Home & Living
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Products for your home and lifestyle.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-gray-900 hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>

        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Trending Now
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-gray-900 hover:underline sm:block"
            >
              View All Products →
            </Link>
          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Product 1 */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

              <div className="flex h-64 items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Fashion Store
                </p>

                <h3 className="mt-2 font-semibold text-gray-900">
                  Classic T-Shirt
                </h3>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹799
                </p>
              </div>

            </div>


            {/* Product 2 */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

              <div className="flex h-64 items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Electronics Store
                </p>

                <h3 className="mt-2 font-semibold text-gray-900">
                  Wireless Headphones
                </h3>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹2,499
                </p>
              </div>

            </div>


            {/* Product 3 */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

              <div className="flex h-64 items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Home & Living
                </p>

                <h3 className="mt-2 font-semibold text-gray-900">
                  Modern Lamp
                </h3>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹1,299
                </p>
              </div>

            </div>


            {/* Product 4 */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

              <div className="flex h-64 items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Fashion Store
                </p>

                <h3 className="mt-2 font-semibold text-gray-900">
                  Casual Sneakers
                </h3>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹1,999
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Why Zaalima
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Everything you need for easy shopping
          </h2>
        </div>


        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-gray-200 p-8">
            <div className="mb-5 text-3xl">🏪</div>

            <h3 className="text-lg font-semibold text-gray-900">
              Multiple Stores
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Discover products from different vendors through one
              unified shopping platform.
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 p-8">
            <div className="mb-5 text-3xl">🔒</div>

            <h3 className="text-lg font-semibold text-gray-900">
              Secure Shopping
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Shop confidently with a secure checkout and payment
              experience.
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 p-8">
            <div className="mb-5 text-3xl">🚚</div>

            <h3 className="text-lg font-semibold text-gray-900">
              Easy Orders
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Manage your purchases and keep track of your orders
              from one place.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-black">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start shopping?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Explore stores and discover products from vendors
            across the platform.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Start Shopping
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Home;