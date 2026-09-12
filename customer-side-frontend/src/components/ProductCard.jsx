import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Check, ShoppingBag } from "lucide-react";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const productId = product.id || product._id;
  const storeId = product.storeId?._id || product.storeId;
  const storeName = product.storeId?.name || product.store || "Store";
  const image = product.images && product.images.length > 0 ? product.images[0] : (product.image || "");
  const stock = Number(product.inventoryCount ?? product.stock ?? 0);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    dispatch(
      addToCart({
        id: productId,
        _id: productId,
        storeId: storeId,
        storeName: storeName,
        name: product.name,
        price: product.price,
        image: image,
        stock: stock,
        quantity: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white transition hover:-translate-y-1 hover:border-[#B8892B]/40 hover:shadow-md">
      <div>
        {/* Product Image */}
        <Link to={`/products/${productId}`}>
          <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#FAFAF7]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-sm text-[#9A9D96]">Product Image</span>
            )}
            {isOutOfStock ? (
              <span className="absolute top-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                Out of Stock
              </span>
            ) : stock <= 5 ? (
              <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                Only {stock} left
              </span>
            ) : null}
          </div>
        </Link>

        {/* Product Information */}
        <div className="p-5 pb-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
            {storeName}
          </p>

          <Link to={`/products/${productId}`}>
            <h2 className="mt-2 font-semibold text-[#14201C] line-clamp-1 hover:underline">
              {product.name}
            </h2>
          </Link>

          <p className="mt-2 text-lg font-bold text-[#14201C]">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : added
              ? "bg-emerald-600 text-white"
              : "bg-[#0F2C27] text-white hover:bg-[#123832]"
          }`}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : added ? (
            <>
              <Check size={16} />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;