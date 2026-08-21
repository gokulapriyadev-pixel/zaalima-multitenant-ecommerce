import { Link, useParams } from "react-router-dom";
import { useState } from "react";

function ProductDetails() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  // Temporary product data
  // Later this will come from the backend API
  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      price: 799,
      category: "Fashion",
      store: "Fashion Store",
      description:
        "A comfortable and versatile classic t-shirt designed for everyday wear. Made with soft and breathable fabric.",
      image: "",
      stock: 20,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 2499,
      category: "Electronics",
      store: "Electronics Store",
      description:
        "Enjoy clear audio and comfortable listening with these wireless headphones.",
      image: "",
      stock: 12,
    },
    {
      id: 3,
      name: "Modern Table Lamp",
      price: 1299,
      category: "Home",
      store: "Home & Living",
      description:
        "A modern table lamp designed to add a clean and elegant look to your room.",
      image: "",
      stock: 8,
    },
    {
      id: 4,
      name: "Casual Sneakers",
      price: 1999,
      category: "Fashion",
      store: "Fashion Store",
      description:
        "Comfortable casual sneakers suitable for everyday activities and outings.",
      image: "",
      stock: 15,
    },
  ];

  const product = products.find(
    (item) => item.id === Number(id)
  );

  // Product not found
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#14201C]">
            Product Not Found
          </h1>

          <p className="mt-3 text-[#6B6F6D]">
            The product you are looking for does not exist.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: product.id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    console.log("Buy now:", {
      productId: product.id,
      quantity,
    });
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-[#E4E1D9]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#6B6F6D]">
            <Link
              to="/"
              className="hover:text-[#0F2C27]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/products"
              className="hover:text-[#0F2C27]"
            >
              Products
            </Link>

            <span>/</span>

            <span className="text-[#14201C]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-2">

          {/* Product Image */}
          <div className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-2xl bg-[#FAFAF7]">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[#9A9D96]">
                Product Image
              </span>
            )}

          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#14201C]">
              {product.name}
            </h1>

            {/* Store */}
            <p className="mt-4 text-sm text-[#6B6F6D]">
              Sold by{" "}
              <span className="font-medium text-[#14201C]">
                {product.store}
              </span>
            </p>

            {/* Price */}
            <p className="mt-6 text-3xl font-bold text-[#14201C]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* Description */}
            <p className="mt-6 leading-7 text-[#6B6F6D]">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mt-8">

                <p className="mb-3 text-sm font-medium text-[#14201C]">
                  Quantity
                </p>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#E4E1D9]">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    className="px-4 py-2 text-lg text-[#14201C] hover:bg-[#FAFAF7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="min-w-12 border-x border-[#E4E1D9] px-4 py-2 text-center text-sm font-medium text-[#14201C]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity === product.stock}
                    className="px-4 py-2 text-lg text-[#14201C] hover:bg-[#FAFAF7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-lg border border-[#0F2C27] px-6 py-3 text-sm font-semibold text-[#0F2C27] transition hover:bg-[#0F2C27]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123832] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Product Information */}
      <section className="border-t border-[#E4E1D9] bg-[#FAFAF7]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <h2 className="font-serif text-2xl text-[#14201C]">
            Product Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">
                Category
              </p>

              <p className="mt-1 font-semibold text-[#14201C]">
                {product.category}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">
                Store
              </p>

              <p className="mt-1 font-semibold text-[#14201C]">
                {product.store}
              </p>
            </div>

            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">
                Availability
              </p>

              <p className="mt-1 font-semibold text-[#14201C]">
                {product.stock} units
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default ProductDetails;