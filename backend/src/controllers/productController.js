const Product = require('../models/product');

exports.addProduct = async (req, res) => {
    const {name, price, stock, storeId} = req.body;

    const product = await Product.create({
        name,
        price,
        stock,
        storeId
    });
    res.json(product);
}