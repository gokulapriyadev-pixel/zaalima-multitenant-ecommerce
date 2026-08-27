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


exports.getProducts = async (req, res) => {
     if (req.user.role === "superadmin") {

        const products = await Product.find();

        return res.json(products);
    }

    const stores = await Store.find({
        ownerId: req.user.id
    });

    const storeIds = stores.map(store => store._id);

    const products = await Product.find({
        storeId: { $in: storeIds }
    });

    res.json(products);
};



exports.getProductById = async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const store = await Store.findById(product.storeId);

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
            message: "You are not allowed to access this product"
        });
    }

    res.json(product);
};


exports.updateProduct = async (req, res) => {

    const { id } = req.params;

    const { name, price, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const store = await Store.findById(product.storeId);

    if (!store) {
        return res.status(404).json({
            message: "Store not found"
        });
    }

    // Vendor can update only their own store's product
    if (
        req.user.role !== "superadmin" &&
        store.ownerId.toString() !== req.user.id
    ) {
        return res.status(403).json({
            message: "You are not allowed to update this product"
        });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    await product.save();

    res.json(product);
};


exports.deleteProduct = async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const store = await Store.findById(product.storeId);

    if (!store) {
        return res.status(404).json({
            message: "Store not found"
        });
    }

    // Vendor can delete only products from their own store
    if (
        req.user.role !== "superadmin" &&
        store.ownerId.toString() !== req.user.id
    ) {
        return res.status(403).json({
            message: "You are not allowed to delete this product"
        });
    }

    await Product.findByIdAndDelete(id);

    res.json({
        message: "Product deleted successfully"
    });
};