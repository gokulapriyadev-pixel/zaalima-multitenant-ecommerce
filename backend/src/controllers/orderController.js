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