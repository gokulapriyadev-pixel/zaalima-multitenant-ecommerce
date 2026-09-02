const { sendEmail } = require('../config/email');

const sendPaymentSuccessEmail = async (to, order) => {
  const subject = `Payment Successful - Order ${order._id}`;

  const text = `
Your payment was successful.

Order ID: ${order._id}
Amount: Rs.${order.totalAmount}
Payment Status: ${order.paymentStatus}

Thank you for your order.
  `;

  const html = `
    <h2>Payment Successful</h2>
    <p>Your payment has been successfully completed.</p>

    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Amount:</strong> Rs.${order.totalAmount}</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

    <p>Thank you for your order.</p>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html
  });
};

module.exports = {
  sendPaymentSuccessEmail
};
