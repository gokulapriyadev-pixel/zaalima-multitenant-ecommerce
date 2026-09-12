# Zaalima Multi-Tenant E-Commerce Platform

A production-grade, multi-tenant e-commerce marketplace platform engineered with a **Node.js/Express REST API**, **MongoDB**, a customer-facing marketplace, a dedicated merchant vendor dashboard, and a centralized platform **Super Admin Suite**.

---

## 🏗️ System Architecture

The repository is structured into three primary decoupled workspaces:

```
zaalima-multitenant-ecommerce/
├── backend/                  # Node.js & Express REST API with MongoDB & Mongoose
├── customer-side-frontend/   # React + Vite + Tailwind CSS Customer Marketplace
└── frontend-vendor/          # React + Vite + Tailwind CSS Vendor Portal & Super Admin Suite
```

- **`backend/` (Port 5000)**:
  - Role-Based Access Control (`customer`, `vendor`, `super_admin`).
  - Multi-tenant tenant data isolation and atomic inventory management.
  - Razorpay payment order generation and webhook verification.
  - Cloudinary asset media pipelines for stores and products.
  - Seeder script for initializing the Super Admin platform account.

- **`customer-side-frontend/` (Port 5173)**:
  - Real-time marketplace discovery, store browsing, and dynamic search.
  - Multi-tenant cart isolation preventing cross-store checkout corruption.
  - Live inventory validation with out-of-stock prevention.
  - Coupon redemption engine with real-time discount calculation.
  - Razorpay payment checkout integration and order tracking.

- **`frontend-vendor/` (Port 5174)**:
  - **Merchant Vendor Portal** (`/dashboard`, `/products`, `/orders`, `/coupons`, `/settings`):
    - Product catalog management with custom categories and variant pricing.
    - Order fulfillment workflow (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).
    - Store coupon generator (percentage discounts, expiry, usage caps).
    - 7-day sales trend analytics chart and lifecycle order status breakdown.
  - **Super Admin Suite** (`/admin/dashboard`, `/admin/stores`, `/admin/users`, `/admin/orders`):
    - Platform-wide Gross Revenue analytics and global order counts.
    - Store network moderation with 1-click **Activate / Suspend Store** action.
    - Complete platform user directory with role filtering (`customer`, `vendor`, `super_admin`).
    - Global real-time orders inspection stream across all marketplace stores.

---

## ✨ Key Features & Highlights

### 1. Multi-Tenant Cart Isolation & Out-of-Stock Guardrails
- **Cart Isolation**: Detects when a customer attempts to add an item from a different store and presents an explicit reset confirmation to preserve store fulfillment boundaries.
- **Inventory Deductions**: Uses atomic MongoDB updates (`$inc: { countInStock: -qty }`) with automatic rollback if an order fails during validation or checkout.

### 2. Merchant Discount Coupons Engine
- Vendors can create dynamic coupons (e.g. `SAVE20`, `FESTIVE10`) scoped to their store.
- Validates expiration dates, maximum redemption limits, and active status.
- Real-time discount calculation rendered directly in the customer checkout flow.

### 3. Super Admin Platform Oversight
- **Role-Based Guards**: Strictly separated routes with `AdminProtectedRoute` ensuring non-admin users cannot access administrative endpoints.
- **Store Moderation**: Instant store suspension hides inactive store listings from public discovery.
- **Unified Light Theme**: Cohesive design palette across both vendor and administrative interfaces.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string
- **Cloudinary Account**: For product and store logo image uploads
- **Razorpay Account**: For payment processing (Test mode keys supported)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/zaalima

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Super Admin Seeder Credentials
ADMIN_NAME="Platform Admin"
ADMIN_EMAIL=admin@zaalima.com
ADMIN_PASSWORD=AdminPassword123!

# Payments (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_optional_webhook_secret

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Transactional Email (Optional)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=your_smtp_user
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=no-reply@zaalima.com
```

#### Seed the Super Admin Account:
Run the seeder script once to initialize the platform Super Admin:

```bash
node seeder.js
```

#### Start the Backend API Server:
```bash
npm run dev
# Server running on http://localhost:5000
```

---

### 2. Customer Marketplace Frontend Setup

```bash
cd ../customer-side-frontend
npm install
npm run dev
# Marketplace running on http://localhost:5173
```

---

### 3. Merchant & Super Admin Frontend Setup

```bash
cd ../frontend-vendor
npm install
npm run dev
# Portal running on http://localhost:5174
```

---

## 🧭 Platform Access & Role Routing

| Portal | URL Route | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** | `http://localhost:5173/` | Public / Customer | Marketplace browsing, store pages, cart, and checkout. |
| **Merchant Login** | `http://localhost:5174/login` | Vendor & Super Admin | Unified entry point for merchants and platform administrators. |
| **Vendor Dashboard** | `http://localhost:5174/dashboard` | `vendor` | Store management, product listings, orders, and coupons. |
| **Super Admin Overview** | `http://localhost:5174/admin/dashboard` | `super_admin` | Global revenue KPI metrics, store health, and platform activity. |
| **Stores Moderation** | `http://localhost:5174/admin/stores` | `super_admin` | Audit merchant stores and toggle Active / Suspended status. |
| **Users Directory** | `http://localhost:5174/admin/users` | `super_admin` | Search and filter all registered customers, vendors, and admins. |
| **Global Orders** | `http://localhost:5174/admin/orders` | `super_admin` | Platform-wide order inspection and fulfillment auditing. |

---

## 🛡️ Security & Route Guards

- **JWT Bearer Token**: Automatically injected via Axios request interceptors across frontend services.
- **Role Verification**:
  - `authMiddleware.js` on Express backend restricts routes via `authorizeRoles(...)`.
  - `ProtectedRoute.jsx` ensures only vendors access merchant store features.
  - `AdminProtectedRoute.jsx` ensures only verified `super_admin` tokens access `/admin/*` views.
  - Non-admin attempts to access `/admin/*` are automatically redirected to safety.

---

## 📜 License
ISC / Proprietary & Confidential - Built for the Zaalima Multi-Tenant Platform.
