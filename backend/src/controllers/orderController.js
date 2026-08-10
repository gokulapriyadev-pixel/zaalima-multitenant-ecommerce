const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const {products, totoalAmount} = req.body;

    const order = await Order.create({
        userId : req.userId,
        products ,
        totalAmount
    });
    res.json(order);
}