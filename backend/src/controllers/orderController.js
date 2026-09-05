const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.createOrder = async (req, res) => {

    const { products } = req.body;

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        let totalAmount = 0;
        let storeId = null;

        const orderProducts = [];

        for (const item of products) {

            const product = await Product
                .findById(item.productId)
                .session(session);

            if (!product) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            if (!storeId) {
                storeId = product.storeId;
            }

            if (
                product.storeId.toString() !==
                storeId.toString()
            ) {
                throw new Error(
                    "Products must belong to the same store"
                );
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for ${product.name}`
                );
            }

            const itemTotal =
                product.price * item.quantity;

            totalAmount += itemTotal;

            orderProducts.push({
                productId: product._id,
                quantity: item.quantity
            });
        }

        const order = await Order.create(
            [{
                userId: req.user.id,
                storeId,
                products: orderProducts,
                totalAmount
            }],
            { session }
        );

        await session.commitTransaction();

        res.status(201).json(order[0]);

    } catch (error) {

        await session.abortTransaction();

        res.status(400).json({
            message: error.message
        });

    } finally {

        session.endSession();
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.productId");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot access this order"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch order"
        });
    }
};