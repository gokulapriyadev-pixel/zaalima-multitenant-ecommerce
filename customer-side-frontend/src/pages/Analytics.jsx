import { useEffect, useState } from "react";
import { getStoreAnalytics } from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getStoreAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#14201C]">
          Store Analytics
        </h1>

        <p className="mt-2 text-gray-600">
          {analytics.storeName}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-2 text-3xl font-bold">
              {analytics.totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold">
              ₹{Number(analytics.totalRevenue).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Low Inventory Items</p>
            <p className="mt-2 text-3xl font-bold">
              {analytics.lowInventoryItems}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#14201C]">
            Low Inventory Products
          </h2>

          {analytics.lowInventoryProducts.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No low inventory products.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {analytics.lowInventoryProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{product.price}
                    </p>
                  </div>

                  <p className="font-semibold text-red-600">
                    {product.inventoryCount} left
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Analytics;