const API_BASE_URL = "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

// ==========================================
// AUTH
// ==========================================

export const loginUser = async (email, password) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async (
  name,
  email,
  password
) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      role: "customer",
    }),
  });
};

// ==========================================
// STORES
// ==========================================

// Get all public stores
export const getPublicStores = async () => {
  return request("/stores/public");
};

// Get one public store by slug
export const getPublicStoreBySlug = async (slug) => {
  return request(
    `/stores/${encodeURIComponent(slug)}`
  );
};

// Alias for compatibility with StoreDetails.jsx
export const getStoreBySlug = async (slug) => {
  return request(
    `/stores/${encodeURIComponent(slug)}`
  );
};

// Get products belonging to a public store
export const getStoreProducts = async (storeId) => {
  return request(`/products/store/${storeId}`);
};

// Get one public product by ID
export const getProductById = async (productId) => {
  return request(`/products/${productId}`);
};

// ==========================================
// CART
// ==========================================

// Add product to customer's backend cart
export const addProductToCart = async (
  storeId,
  productId,
  quantity
) => {
  return request("/cart", {
    method: "POST",
    body: JSON.stringify({
      storeId,
      productId,
      quantity,
    }),
  });
};

// Get customer's cart for a specific store
export const getCart = async (storeId) => {
  return request(`/cart/${storeId}`);
};

export const updateCartItemQuantity = async (
  storeId,
  productId,
  quantity
) =>
  request(`/cart/${storeId}/item/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

export const removeFromCart = async (storeId, productId) =>
  request(`/cart/${storeId}/item/${productId}`, {
    method: "DELETE",
  });

export const clearCart = async (storeId) =>
  request(`/cart/${storeId}/clear`, {
    method: "DELETE",
  });

// ==========================================
// ORDERS
// ==========================================

export const createOrder = async (orderData) => {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getMyOrders = async () =>
  request("/orders");

export const getOrderById = async (orderId) =>
  request(`/orders/${orderId}`);

export const getStoreOrders = async (storeId) =>
  request(`/orders/store/${storeId}`);

export const updateOrderStatus = async (orderId, orderStatus) =>
  request(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ orderStatus }),
  });

// ==========================================
// RAZORPAY
// ==========================================

export const createRazorpayOrder = async (orderId) => {
  return request("/payments/create-order", {
    method: "POST",
    body: JSON.stringify({
      orderId,
    }),
  });
};

export const verifyRazorpayPayment = async (
  paymentData
) => {
  return request("/payments/verify", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};

// ==========================================
// ANALYTICS
// ==========================================

export const getStoreAnalytics = async () => {
  return request("/orders/analytics/my-store");
};

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default {
  loginUser,
  registerUser,

  getPublicStores,
  getPublicStoreBySlug,
  getStoreBySlug,

  getStoreProducts,
  getProductById,

  addProductToCart,
  getCart,

  createOrder,

  createRazorpayOrder,
  verifyRazorpayPayment,

  getStoreAnalytics,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getMyOrders,
  getOrderById
};