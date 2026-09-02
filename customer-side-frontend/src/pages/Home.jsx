import { Link } from "react-router-dom";
import { ShieldCheck, Store as StoreIcon, Truck } from "lucide-react";


import headphone from "../assets/headphone.png";
import sneakers from "../assets/sneakers.png";
import softdrink from "../assets/soft-drink.png";
import wardop from "../assets/wardop.png";
import applience from "../assets/home_applience.png";

const Home = () => {
  return (
    <main className="bg-white">


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#FAFAF7]">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle, #0F2C27 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Hero Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8892B]">
              Discover • Shop • Enjoy
            </p>

            <h1 className="max-w-xl font-serif text-5xl leading-tight tracking-tight text-[#14201C] sm:text-6xl">
              Discover products from stores you love.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B6F6D]">
              Explore multiple stores, discover amazing products, and enjoy
              a simple shopping experience — all from one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123832]"
              >
                Shop Products
              </Link>

              <Link
                to="/stores"
                className="rounded-lg border border-[#0F2C27]/20 bg-white px-6 py-3 text-sm font-semibold text-[#14201C] transition hover:bg-[#0F2C27]/5"
              >
                Explore Stores
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[400px] w-full max-w-[500px]">
            
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8892B]/25 blur-2xl" />
          

             <div
                className="absolute flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white p-3 shadow-lg  sm:h-32 sm:w-32"
                style={{ left: "34%", top: "24%", transform: "translate(-50%, -50%) rotate(-10deg)", zIndex: 20 }}
              >
                <img src={sneakers} alt="Casual sneakers" className="h-full w-full object-cover" />
              </div>

                   <div
                className="absolute flex h-28 w-28 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white p-3 shadow-lg  sm:h-32 sm:w-32"
                style={{ left: "66%", top: "18%", transform: "translate(-50%, -50%) rotate(8deg)", zIndex: 20 }}
              >
                <img src={softdrink} alt="Soft drink" className="h-full w-full object-cover" />
              </div>

              <div
                className="absolute flex h-28 w-28 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white p-3 shadow-lg  sm:h-32 sm:w-32"
                style={{ left: "30%", top: "68%", transform: "translate(-50%, -50%) rotate(6deg)", zIndex: 10 }}
              >
                <img src={wardop} alt="Wardrobe" className="h-full w-full object-cover" />
              </div>

              <div
                className="absolute flex h-28 w-28 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white p-3 shadow-lg   sm:h-32 sm:w-32"
                style={{ left: "75%", top: "68%", transform: "translate(-50%, -50%) rotate(-15deg)", zIndex: 10 }}
              >
                <img src={applience} alt="Home appliance" className="h-full w-full object-cover" />
              </div>

              <div
                className="absolute flex h-28 w-28 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white p-4 shadow-xl  sm:h-36 sm:w-36"
                style={{ left: "50%", top: "49%", transform: "translate(-50%, -50%) rotate(0deg)", zIndex: 30 }}
              >
                <img src={headphone} alt="Wireless headphones" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================= FEATURED STORES ================= */}
      {/* Dummy data below — swap this section for your <Stores /> component */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
              Explore
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
              Featured Stores
            </h2>
          </div>

          <Link
            to="/stores"
            className="hidden text-sm font-semibold text-[#0F2C27] hover:underline sm:block"
          >
            View All Stores →
          </Link>
        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="group overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-[#FAFAF7]">
              <span className="text-sm text-[#9A9D96]">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-[#14201C]">
                Fashion Store
              </h3>

              <p className="mt-2 text-sm text-[#6B6F6D]">
                Fashion, clothing and accessories.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-[#0F2C27] hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>


          <div className="group overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-[#FAFAF7]">
              <span className="text-sm text-[#9A9D96]">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-[#14201C]">
                Electronics Store
              </h3>

              <p className="mt-2 text-sm text-[#6B6F6D]">
                Gadgets, electronics and accessories.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-[#0F2C27] hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>


          <div className="group overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-[#FAFAF7]">
              <span className="text-sm text-[#9A9D96]">
                Store Image
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-[#14201C]">
                Home & Living
              </h3>

              <p className="mt-2 text-sm text-[#6B6F6D]">
                Products for your home and lifestyle.
              </p>

              <Link
                to="/stores"
                className="mt-4 inline-block text-sm font-semibold text-[#0F2C27] hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </div>

        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      {/* Dummy data below — swap this section for your <Products /> / <ProductCard /> components */}
      <section className="bg-[#FAFAF7]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
                Trending Now
              </p>

              <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-[#0F2C27] hover:underline sm:block"
            >
              View All Products →
            </Link>
          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Product 1 */}
            <div className="overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">

              <div className="flex h-64 items-center justify-center bg-white">
                <span className="text-sm text-[#9A9D96]">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
                  Fashion Store
                </p>

                <h3 className="mt-2 font-semibold text-[#14201C]">
                  Classic T-Shirt
                </h3>

                <p className="mt-2 text-lg font-bold text-[#14201C]">
                  ₹799
                </p>
              </div>

            </div>


            {/* Product 2 */}
            <div className="overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">

              <div className="flex h-64 items-center justify-center bg-white">
                <span className="text-sm text-[#9A9D96]">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
                  Electronics Store
                </p>

                <h3 className="mt-2 font-semibold text-[#14201C]">
                  Wireless Headphones
                </h3>

                <p className="mt-2 text-lg font-bold text-[#14201C]">
                  ₹2,499
                </p>
              </div>

            </div>


            {/* Product 3 */}
            <div className="overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">

              <div className="flex h-64 items-center justify-center bg-white">
                <span className="text-sm text-[#9A9D96]">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
                  Home & Living
                </p>

                <h3 className="mt-2 font-semibold text-[#14201C]">
                  Modern Lamp
                </h3>

                <p className="mt-2 text-lg font-bold text-[#14201C]">
                  ₹1,299
                </p>
              </div>

            </div>


            {/* Product 4 */}
            <div className="overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition hover:shadow-md">

              <div className="flex h-64 items-center justify-center bg-white">
                <span className="text-sm text-[#9A9D96]">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
                  Fashion Store
                </p>

                <h3 className="mt-2 font-semibold text-[#14201C]">
                  Casual Sneakers
                </h3>

                <p className="mt-2 text-lg font-bold text-[#14201C]">
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
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
            Why Zaalima
          </p>

          <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#14201C]">
            Everything you need for easy shopping
          </h2>
        </div>


        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-[#E4E1D9] p-8">
            <div className="mb-5 text-3xl">🏪</div>

            <h3 className="text-lg font-semibold text-[#14201C]">
              Multiple Stores
            </h3>

            <p className="mt-3 leading-7 text-[#6B6F6D]">
              Discover products from different vendors through one
              unified shopping platform.
            </p>
          </div>


          <div className="rounded-xl border border-[#E4E1D9] p-8">
            <div className="mb-5 text-3xl">🔒</div>

            <h3 className="text-lg font-semibold text-[#14201C]">
              Secure Shopping
            </h3>

            <p className="mt-3 leading-7 text-[#6B6F6D]">
              Shop confidently with a secure checkout and payment
              experience.
            </p>
          </div>


          <div className="rounded-xl border border-[#E4E1D9] p-8">
            <div className="mb-5 text-3xl">🚚</div>

            <h3 className="text-lg font-semibold text-[#14201C]">
              Easy Orders
            </h3>

            <p className="mt-3 leading-7 text-[#6B6F6D]">
              Manage your purchases and keep track of your orders
              from one place.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-[#EDE3CF]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
 
          <h2 className="font-serif text-3xl tracking-tight text-[#14201C] sm:text-4xl">
            Ready to start shopping?
          </h2>
 
          <p className="mx-auto mt-4 max-w-xl text-[#5C574E]">
            Explore stores and discover products from vendors
            across the platform.
          </p>
 
          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-[#B8892B] px-6 py-3 text-sm font-semibold text-[#14201C] transition hover:bg-[#C79A38]"
          >
            Start Shopping
          </Link>
 
        </div>
      </section>

    </main>
  );
}

export default Home;