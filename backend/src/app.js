const express = require('express');
const cors = require("cors");

const app = express();

// Stripe webhook
app.post(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' }),
    require('./controllers/stripeWebhookController').handleWebhook
);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.use(require('./middleware/errorMiddleware'))


module.exports = app;