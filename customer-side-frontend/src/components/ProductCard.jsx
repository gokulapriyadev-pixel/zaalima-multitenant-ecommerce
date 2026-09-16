import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  // Backend uses inventoryCount as the actual stock field.
  // Keep stock as a fallback for older frontend data.
  const inventory =
    product.inventoryCount ?? product.stock ?? 10;

  const targetStoreId =
    typeof product.storeId === "object"
      ? product.storeId?._id
      : product.storeId || product.store?._id;

  const targetStoreName =
    product.store?.name ||
    (typeof product.store === "string" ? product.store : null) ||
    product.storeId?.name ||
    product.storeName ||
    "Store";

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id || product._id,
        _id: product.id || product._id,
        name: product.name,
        price: product.price,
        image:
          product.image ||
          (product.images && product.images.length > 0
            ? product.images[0]
            : ""),
        stock: inventory,
        storeId: targetStoreId,
        storeName: targetStoreName,
        quantity: 1,
      })
    );
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white transition hover:-translate-y-1 hover:border-[#B8892B]/40 hover:shadow-md">

      {/* Product Image */}
      <Link to={`/products/${product.id || product._id}`}>
        <div className="flex h-64 items-center justify-center overflow-hidden bg-[#FAFAF7]">
          {product.image ||
          (product.images && product.images.length > 0) ? (
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-sm text-[#9A9D96]">
              Product Image
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5">

        {/* Store */}
        <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
          {product.store?.name || product.store || "Store"}
        </p>

        {/* Product Name */}
        <Link to={`/products/${product.id || product._id}`}>
          <h2 className="mt-2 font-semibold text-[#14201C] hover:underline">
            {product.name}
          </h2>
        </Link>

        {/* Price */}
        <p className="mt-2 text-lg font-bold text-[#14201C]">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={inventory <= 0}
          className="mt-4 w-full rounded-lg bg-[#0F2C27] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123832] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {inventory > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;