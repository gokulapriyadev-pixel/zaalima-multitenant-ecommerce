# Zaalima Multitenant E-Commerce

A multi-tenant e-commerce application with a Node.js/Express backend, MongoDB database, Razorpay payments, and transactional email support.

## Backend Setup

### Requirements

- Node.js 24+
- npm
- MongoDB
- Razorpay Test Mode account
- SMTP email account

### Install Backend Dependencies

```bash
cd backend
npm install

PORT=5000

MONGO_URI=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

JWT_SECRET=
RAZORPAY_WEBHOOK_SECRET=