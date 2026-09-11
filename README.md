# Zaalima Multitenant E-Commerce

A multi-tenant e-commerce platform featuring a Node.js/Express backend, MongoDB database, customer marketplace frontend, and vendor dashboard.

## Architecture

- **`backend/`**: Node.js & Express REST API with Mongoose, JWT authentication, Razorpay payments, and Cloudinary uploads.
- **`customer-side-frontend/`**: React + Vite + Tailwind CSS customer marketplace for browsing stores, purchasing products, cart management, and Razorpay checkout.
- **`frontend-vendor/`**: React + Vite + Tailwind CSS vendor dashboard for managing stores, products, orders, and analytics.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory using `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Transactional Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Start the backend:
```bash
npm run dev
```

### 2. Customer Frontend Setup

```bash
cd customer-side-frontend
npm install
npm run dev
```

### 3. Vendor Dashboard Setup

```bash
cd frontend-vendor
npm install
npm run dev
```
