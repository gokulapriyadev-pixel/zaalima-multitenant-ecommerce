import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  addProductToCart,
} from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product || data);
      } catch (err) {
        console.error("Failed to load product:", err);

        setError(
          err.message || "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-sm text-[#6B6F6D]">
          Loading product...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#14201C]">
            Product Not Found
          </h1>

          <p className="mt-3 text-red-600">
            {error || "This product could not be found."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const image =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.imageUrl ||
    product.image;

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage("");

      const storeId =
        typeof product.storeId === "object"
          ? product.storeId?._id
          : product.storeId;

      if (!storeId) {
        throw new Error(
          "Store information is missing for this product."
        );
      }

      if (!product._id) {
        throw new Error(
          "Product ID is missing."
        );
      }

      await addProductToCart(
        storeId,
        product._id,
        1
      );

      setCartMessage(
        "Product added to cart!"
      );

      setTimeout(() => {
        navigate("/cart");
      }, 500);
    } catch (err) {
      console.error(
        "Failed to add product to cart:",
        err
      );

      setCartMessage(
        err.message ||
          "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ==========================================
  // PRODUCT DETAILS PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          to="/products"
          className="text-sm font-medium text-[#6B6F6D] hover:text-[#14201C]"
        >
          ← Back to Products
        </Link>

        {/* Product Container */}
        <div className="mt-8 grid gap-10 rounded-2xl border border-[#E4E1D9] bg-white p-6 md:grid-cols-2 md:p-10">

          {/* ==========================================
              PRODUCT IMAGE
          ========================================== */}

          <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl bg-[#FAFAF7]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full max-h-[500px] w-full object-contain"
              />
            ) : (
              <span className="text-[#9A9E9B]">
                Product Image
              </span>
            )}
          </div>

          {/* ==========================================
              PRODUCT INFORMATION
          ========================================== */}

          <div className="flex flex-col justify-center">

            {/* Store Name */}
            {product.storeId?.name && (
              <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
                {product.storeId.name}
              </p>
            )}

            {/* Product Name */}
            <h1 className="mt-3 font-serif text-4xl text-[#14201C]">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mt-5 text-3xl font-bold text-[#14201C]">
              ₹
              {Number(product.price).toLocaleString(
                "en-IN"
              )}
            </p>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-[#14201C]">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-[#6B6F6D]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Inventory */}
            <div className="mt-6">
              <p className="text-sm text-[#6B6F6D]">
                Available Stock
              </p>

              <p className="mt-1 font-semibold text-[#14201C]">
                {product.inventoryCount ?? 0} available
              </p>
            </div>

            {/* Add To Cart Button */}
            <button
              type="button"
              disabled={
                addingToCart ||
                (product.inventoryCount ?? 0) <= 0
              }
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-lg bg-[#0F2C27] px-6 py-4 font-semibold text-white transition hover:bg-[#173D35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addingToCart
                ? "Adding..."
                : (product.inventoryCount ?? 0) <= 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {/* Cart Message */}
            {cartMessage && (
              <p
                className={`mt-3 text-sm ${
                  cartMessage ===
                  "Product added to cart!"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {cartMessage}
              </p>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;