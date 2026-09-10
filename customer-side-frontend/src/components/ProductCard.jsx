import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white transition hover:-translate-y-1 hover:border-[#B8892B]/40 hover:shadow-md">

      {/* Product Image */}
      <Link to={`/products/${product.id || product._id}`}>
        <div className="flex h-64 items-center justify-center overflow-hidden bg-[#FAFAF7]">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
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

        <p className="text-xs font-medium uppercase tracking-wide text-[#B8892B]">
          {product.store}
        </p>

        <Link to={`/products/${product.id}`}>
          <h2 className="mt-2 font-semibold text-[#14201C] hover:underline">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-lg font-bold text-[#14201C]">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-[#0F2C27] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123832]"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;