const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Store = require('../models/Store');

/**
 * @desc    Get the logged-in vendor's Store ID
 * @helper  Internal helper to prevent redundant queries
 */
const getVendorStoreId = async (userId) => {
    const store = await Store.findOne({ ownerId: userId });
    if (!store) {
        throw new Error('You must create a store before managing products or categories.');
    }
    return store._id;
};

// ==========================================
// CATEGORY CONTROLLERS
// ==========================================

/**
 * @desc    Create a new category for the vendor's store
 * @route   POST /api/categories
 * @access  Private (Vendor only)
 */
const createCategory = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    const storeId = await getVendorStoreId(req.user._id);

    // Mongoose compound index handles duplicate slugs per store, 
    // but this gives a cleaner error message.
    const categoryExists = await Category.findOne({ storeId, slug });
    if (categoryExists) {
        res.status(400);
        throw new Error('A category with this slug already exists in your store.');
    }

    const category = await Category.create({
        storeId,
        name,
        slug
    });

    res.status(201).json(category);
});

/**
 * @desc    Get all categories for a specific store (Public storefront)
 * @route   GET /api/categories/:storeId
 * @access  Public
 */
const getStoreCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ storeId: req.params.storeId });
    res.json(categories);
});


// ==========================================
// PRODUCT CONTROLLERS
// ==========================================

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Vendor only)
 */
const createProduct = asyncHandler(async (req, res) => {
    const { name, slug, description, price, inventoryCount, categoryId, isPublished } = req.body;
    const storeId = await getVendorStoreId(req.user._id);

    const productExists = await Product.findOne({ storeId, slug });
    if (productExists) {
        res.status(400);
        throw new Error('A product with this URL slug already exists in your store.');
    }

    // Verify category belongs to this store (security check)
    if (categoryId) {
        const category = await Category.findOne({ _id: categoryId, storeId });
        if (!category) {
            res.status(400);
            throw new Error('Invalid category ID for this store.');
        }
    }

    const product = await Product.create({
        storeId,
        categoryId,
        name,
        slug,
        description,
        price,
        inventoryCount,
        isPublished: isPublished !== undefined ? isPublished : false
    });

    res.status(201).json(product);
});

/**
 * @desc    Get all products for a specific store (Public storefront)
 * @route   GET /api/products/:storeId
 * @access  Public
 */
const getStoreProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ 
        storeId: req.params.storeId, 
        isPublished: true 
    }).populate('categoryId', 'name slug'); // Include category details

    res.json(products);
});

module.exports = {
    createCategory,
    getStoreCategories,
    createProduct,
    getStoreProducts
};