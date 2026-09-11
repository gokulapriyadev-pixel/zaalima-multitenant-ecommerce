import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Check, ShoppingBag, ArrowLeft } from "lucide-react";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [addedNotification, setAddedNotification] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/products/${id}`);
        const p = res.data.product;
        setProduct(p);
        if (p.images && p.images.length > 0) {
          setSelectedImage(p.images[0]);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2C27] border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-[#6B6F6D]">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#14201C]">
            Product Not Found
          </h1>
          <p className="mt-3 text-[#6B6F6D]">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0F2C27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123832]"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const stock = Number(product.inventoryCount ?? product.stock ?? 0);
  const isOutOfStock = stock <= 0;
  const storeName = product.storeId?.name || "Store";
  const storeId = product.storeId?._id || product.storeId;
  const categoryName = product.categoryId?.name || "General";
  const displayImage = selectedImage || product.images?.[0] || "";

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    dispatch(
      addToCart({
        id: product._id,
        _id: product._id,
        storeId: storeId,
        storeName: storeName,
        name: product.name,
        price: product.price,
        image: displayImage,
        stock: stock,
        quantity: Math.min(stock, quantity),
      })
    );

    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#E4E1D9]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#6B6F6D]">
            <Link to="/" className="hover:text-[#0F2C27]">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#0F2C27]">
              Products
            </Link>
            <span>/</span>
            <span className="text-[#14201C] font-medium truncate max-w-xs">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image Showcase */}
          <div className="space-y-4">
            <div className="flex min-h-[450px] max-h-[550px] items-center justify-center overflow-hidden rounded-2xl bg-[#FAFAF7] border border-[#E4E1D9]">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <span className="text-sm text-[#9A9D96]">No Image Available</span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === img
                        ? "border-[#0F2C27] ring-2 ring-[#0F2C27]/20"
                        : "border-[#E4E1D9] hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchase Controls */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892B]">
              {categoryName}
            </p>

            {/* Product Name */}
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl tracking-tight text-[#14201C]">
              {product.name}
            </h1>

            {/* Store Badge */}
            <p className="mt-3 text-sm text-[#6B6F6D]">
              Sold by{" "}
              <span className="font-semibold text-[#14201C]">
                {storeName}
              </span>
            </p>

            {/* Price */}
            <p className="mt-5 text-3xl font-bold text-[#14201C]">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>

            {/* Description */}
            <p className="mt-5 leading-7 text-[#6B6F6D] whitespace-pre-line">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mt-6">
              {stock > 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● In Stock ({stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  ● Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {stock > 0 && (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-[#14201C]">
                  Quantity
                </label>
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
                    disabled={quantity >= stock}
                    className="px-4 py-2 text-lg text-[#14201C] hover:bg-[#FAFAF7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Alert */}
            {addedNotification && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 border border-emerald-200 transition">
                <Check size={18} />
                <span>Added {quantity} item(s) to your cart!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F2C27] px-6 py-3.5 text-sm font-semibold text-[#0F2C27] transition hover:bg-[#0F2C27]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400"
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 rounded-xl bg-[#0F2C27] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#123832] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Additional Details */}
      <section className="border-t border-[#E4E1D9] bg-[#FAFAF7]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-[#14201C]">
            Product Specifications
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">Category</p>
              <p className="mt-1 font-semibold text-[#14201C]">{categoryName}</p>
            </div>
            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">Store</p>
              <p className="mt-1 font-semibold text-[#14201C]">{storeName}</p>
            </div>
            <div className="rounded-xl border border-[#E4E1D9] bg-white p-5">
              <p className="text-sm text-[#6B6F6D]">Stock Availability</p>
              <p className="mt-1 font-semibold text-[#14201C]">{stock} units</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;