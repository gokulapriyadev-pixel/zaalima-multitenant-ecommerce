const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const {products, totalAmount} = req.body;

    const order = await Order.create({
        userId : req.user.id,
        products,
        totalAmount
    });
    res.status(201).json(order);
}