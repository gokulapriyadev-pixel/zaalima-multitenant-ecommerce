const Product = require('../models/product');
const Store = require('../models/store')

exports.addProduct = async (req, res) => {

    const { name, price, stock, storeId } = req.body;

    const store = await Store.findById(storeId);

    if (!store) {
        return res.status(404).json({
            message: "Store not found"
        });
    }

    if (
        req.user.role !== "superadmin" &&
        store.ownerId.toString() !== req.user.id
    ) {
        return res.status(403).json({
            message: "You are not allowed to add products to this store"
        });
    }

    const product = await Product.create({
        name,
        price,
        stock,
        storeId
    });

    res.status(201).json(product);
};