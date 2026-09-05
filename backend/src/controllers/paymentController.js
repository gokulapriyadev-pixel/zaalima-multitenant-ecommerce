const stripe = require("../config/stripe");
const Order = require("../models/order");

exports.createCheckoutSession = async (req, res) => {

    try {

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot pay for this order"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Order is not available for payment"
            });
        }

        const lineItems = [];

        for (const item of order.products) {

            const product = await require("../models/product")
                .findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            lineItems.push({
                price_data: {
                    currency: "inr",

                    product_data: {
                        name: product.name
                    },

                    unit_amount: Math.round(product.price * 100)
                },

                quantity: item.quantity
            });
        }

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            mode: "payment",

            line_items: lineItems,

            success_url:
                "http://localhost:3000/payment-success",

            cancel_url:
                "http://localhost:3000/payment-cancel",

            metadata: {
                orderId: order._id.toString()
            }
        });

        order.stripeSessionId = session.id;

        await order.save();

        res.status(200).json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to create checkout session"
        });
    }
};