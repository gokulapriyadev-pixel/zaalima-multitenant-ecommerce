const stripe = require("../config/stripe");
const Order = require("../models/order");

exports.handleWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Payment successful:", session.id);
      console.log("Payment status:", session.payment_status);

      if (session.payment_status !== "paid") {
        console.log("Payment is not completed:", session.payment_status);

        return res.status(200).json({
          received: true,
        });
      }

      const orderId = session.metadata.orderId;

      const order = await Order.findById(orderId);

      if (!order) {
        console.log("Order not found:", orderId);

        return res.status(200).json({
          received: true,
        });
      }

      if (order.stripeSessionId !== session.id) {
        console.log("Stripe session does not belong to this order");

        return res.status(200).json({
          received: true,
        });
      }

      const expectedAmount = Math.round(order.totalAmount * 100);

      if (session.amount_total !== expectedAmount) {
        console.log("Payment amount does not match order amount");

        return res.status(200).json({
          received: true,
        });
      }

      // Prevent duplicate processing
      if (order.status === "paid") {
        console.log("Order already paid:", order._id);

        return res.status(200).json({
          received: true,
        });
      }

      order.status = "paid";

      await order.save();

      console.log(`Order ${order._id} marked as paid`);
    }

    // CHECKOUT EXPIRED
    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      console.log("Checkout session expired:", session.id);

      const orderId = session.metadata.orderId;

      const order = await Order.findById(orderId);

      if (!order) {
        console.log("Order not found:", orderId);

        return res.status(200).json({
          received: true,
        });
      }

      if (order.status === "pending") {
        order.status = "cancelled";

        await order.save();

        console.log(`Order ${order._id} cancelled because checkout expired`);
      }
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};
